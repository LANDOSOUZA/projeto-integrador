const Pedido = require('../models/Pedido')
const Produto = require('../models/Produto')
const Cliente = require('../models/Cliente')
const OpcuaService = require('./opcuaService')

/**
 * Valida se a quantidade total de peças está entre 1 e 3
 */
function validarCombinacao(contagem) {
  const total = Object.values(contagem).reduce((acc, q) => acc + q, 0)
  return total >= 1 && total <= 3
}

/**
 * Converte itens recebidos em objetos prontos para salvar no Pedido
 * Faz uma única query para buscar todos os produtos e valida cada item
 */
async function converterItens(itens) {
  const ids = itens.map(i => i.produtoId)
  const produtos = await Produto.find({ _id: { $in: ids } })
  const mapa = new Map(produtos.map(p => [String(p._id), p]))

  return itens.map(i => {
    const produto = mapa.get(String(i.produtoId))
    if (!produto) {
      throw new Error(`Produto ${i.produtoId} não encontrado`)
    }
    return {
      produtoId: produto._id,
      quantidade: i.quantidade
    }
  })
}

/**
 * Atualiza status de um pedido com validações
 * e reflete no CLP via OPC-UA
 */
async function atualizarStatusPedido(id, novoStatus, validacoes = []) {
  const pedido = await Pedido.findById(id)
  if (!pedido) {
    throw new Error('Pedido não encontrado')
  }

  // Executa validações customizadas
  for (const validar of validacoes) {
    validar(pedido)
  }

  pedido.status = novoStatus
  await pedido.save()

  // 🔗 Integração com CLP
  const opcua = new OpcuaService()
  await opcua.connect()

  if (novoStatus === 'cancelado') {
    await opcua.abortarPedido()
  }

  if (novoStatus === 'pronto') {
    // fim da OP → resetar PLC
    await opcua.resetPLC()
  }

  if (novoStatus === 'em_processamento') {
    await opcua.iniciarProducao()
  }

  await opcua.disconnect()

  return await pedido.populate([
    { path: 'clienteId', select: 'codigo nome email perfil' },
    { path: 'itens.produtoId', select: 'codigo nome preco status' }
  ])
}

/**
 * Buscar cliente pelo código
 */
async function buscarClientePorCodigo(codigo) {
  const cliente = await Cliente.findOne({ codigo })
  if (!cliente) {
    throw new Error('Cliente não encontrado')
  }
  return cliente
}

module.exports = {
  validarCombinacao,
  converterItens,
  atualizarStatusPedido,
  buscarClientePorCodigo
}
