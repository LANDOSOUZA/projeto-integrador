const Pedido = require('../models/Pedido')
const OpcuaService = require('./opcuaService')

async function reordenarFilaMES(pedidoId) {
  const pedidos = await Pedido.find({ status: 'iniciado' }).populate('itens.produtoId')

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

module.exports = { reordenarFilaMES }
