const Pedido = require('../models/Pedido')
const Estoque = require('../models/Estoque')
const OpcuaService = require('./opcuaService')
const { STATUS } = require('../clp/constants/status')

// =======================================
// Reordenar fila MES
// =======================================
async function reordenarFilaMES(pedidoId) {
  const pedidos = await Pedido.find({ status: STATUS.INICIADO }).populate('itens.produtoId')

  if (pedidos.length <= 2) {
    throw new Error('Não há pedidos suficientes para reordenação pelo MES')
  }

  // Sabores dos dois primeiros pedidos
  const saboresPrimeiros = new Set()
  pedidos.slice(0, 2).forEach(p => {
    p.itens.forEach(i => saboresPrimeiros.add(i.produtoId.nome))
  })

  // Índice do pedido alvo
  const pedidoIndex = pedidos.findIndex(p => p._id.toString() === pedidoId)
  if (pedidoIndex === -1) {
    throw new Error('Pedido não encontrado na fila')
  }
  if (pedidoIndex <= 1) {
    throw new Error('O MES não pode alterar os dois primeiros pedidos')
  }

  // Verifica “novo sabor”
  const saboresPedido = new Set()
  pedidos[pedidoIndex].itens.forEach(i => saboresPedido.add(i.produtoId.nome))
  const contemNovoSabor = [...saboresPedido].some(sabor => !saboresPrimeiros.has(sabor))

  if (!contemNovoSabor) {
    throw new Error('O MES não pode antecipar este pedido, pois não contém novos sabores')
  }

  // Move para a 2ª posição
  const [pedidoMovido] = pedidos.splice(pedidoIndex, 1)
  pedidos.splice(1, 0, pedidoMovido)

  // Persiste posição
  for (let i = 0; i < pedidos.length; i++) {
    pedidos[i].posicaoFila = i + 1
    await pedidos[i].save()
  }

  // 🔗 Integração com CLP via OPC UA
  const opcua = new OpcuaService()
  await opcua.connect()

  // Reescreve pedidos no CLP usando método de alto nível
  for (const pedido of pedidos) {
    await opcua.escreverPedido({
      op: pedido._id.toString(),
      produto: pedido.itens[0].produtoId.codigo, // código do produto
      quant: pedido.itens[0].quantidade
    })
  }

  await opcua.disconnect()

  return pedidos
}

// =======================================
// Atualizar produção MES (callback do CLP)
// =======================================
// Iniciar produção de um pedido
async function iniciarProducao(pedidoId) {
  const pedido = await Pedido.findById(pedidoId)
  if (!pedido) throw new Error('Pedido não encontrado')

  pedido.status = STATUS.EM_PRODUCAO
  await pedido.save()
  return pedido
}

// Finalizar produção
async function finalizarPedido(pedidoId) {
  const pedido = await Pedido.findById(pedidoId)
  if (!pedido) throw new Error('Pedido não encontrado')

  pedido.status = STATUS.FINALIZADO
  await pedido.save()
  return pedido
}

// Cancelar pedido
async function cancelarPedido(pedidoId) {
  const pedido = await Pedido.findById(pedidoId)
  if (!pedido) throw new Error('Pedido não encontrado')

  pedido.status = STATUS.CANCELADO
  await pedido.save()
  return pedido
}

// (opcional) funções auxiliares
async function reordenarFilaMES() {
  // lógica futura para reordenar fila
}

async function atualizarProducaoMES() {
  // lógica futura para atualizar produção
}

async function atualizarProducaoMES({ pedidoId, produtoId, quantidadeConsumida }) {
  const pedido = await Pedido.findById(pedidoId).populate('itens.produtoId')
  if (!pedido) throw new Error('Pedido não encontrado')

  const estoque = await Estoque.findOne({ produtoId })
  if (!estoque) throw new Error('Estoque não encontrado')

  // baixa no estoque
  estoque.quantidade -= quantidadeConsumida
  await estoque.save()

  // verifica se acabou insumo
  if (estoque.quantidade < 0) {
    pedido.status = STATUS.PROCESSANDO // travado aguardando reposição
    await pedido.save()
    return { mensagem: 'Estoque insuficiente, pedido travado', pedido }
  }

  // atualiza produção parcial
  pedido.produzido = (pedido.produzido || 0) + quantidadeConsumida

  const totalPedido = pedido.itens.reduce((acc, item) => acc + item.quantidade, 0)
  if (pedido.produzido >= totalPedido) {
    pedido.status = STATUS.PRONTO
  } else {
    pedido.status = STATUS.EM_PROCESSAMENTO
  }

  await pedido.save()
  return { mensagem: 'Produção atualizada com sucesso', pedido }
}

module.exports = { 
  reordenarFilaMES, 
  atualizarProducaoMES,
  iniciarProducao,
  finalizarPedido,
  cancelarPedido
}
