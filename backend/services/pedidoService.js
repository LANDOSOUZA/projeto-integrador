// services/pedidoService.js
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
 */
async function converterItens(itens) {
  const itensConvertidos = []
  for (const item of itens) {
    const produto = await Produto.findById(item.produtoId)
    if (!produto) {
      throw new Error(`Produto ${item.produtoId} não encontrado`)
    }
    itensConvertidos.push({
      produtoId: produto._id,
      quantidade: item.quantidade
    })
  }
  return itensConvertidos
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
    await opcua.session.write({
      nodeId: "ns=3;s=cmd.abortar",
      attributeId: 13,
      value: { value: { dataType: 1, value: true } }
    })
  }

  if (novoStatus === 'pronto') {
    await opcua.session.write({
      nodeId: "ns=3;s=cmd.fimPed",
      attributeId: 13,
      value: { value: { dataType: 1, value: true } }
    })
  }

  if (novoStatus === 'em_processamento') {
    await opcua.session.write({
      nodeId: "ns=3;s=cmd.iniciar",
      attributeId: 13,
      value: { value: { dataType: 1, value: true } }
    })
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
