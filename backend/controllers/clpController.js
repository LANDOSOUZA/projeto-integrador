const Pedido = require('../models/Pedido')
const Produto = require('../models/Produto')
const OpcuaService = require('../services/opcuaService')

async function atualizarStatusCLP(req, res) {
  try {
    const { pedidoId, status, itemId } = req.body

    // Busca o pedido
    let pedido = await Pedido.findById(pedidoId)
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' })
    }

    // Atualiza status do pedido
    console.log("🔔 AtualizarStatusCLP chamado para pedido:", pedidoId)
    pedido.status = 'em_processamento'
    await pedido.save()
    pedido = await Pedido.findById(pedido._id) // hook já popula
    console.log("📝 Pedido após reload:", pedido._id, pedido.status)

    // Busca o produto direto pelo _id
    const produto = await Produto.findById(itemId)
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    // Atualiza estoque (+3 unidades)
    produto.quantidade += 3
    await produto.save()

    res.json({
      mensagem: `Pedido ${pedidoId} atualizado para ${pedido.status}. Inserido três sucos de ${produto.nome} no estoque.`,
      pedido,
      produto
    })
  } catch (err) {
    console.error('❌ Erro ao atualizar status do CLP:', err)
    res.status(500).json({ error: 'Erro ao atualizar status do CLP', detalhe: err.message })
  }
}

async function iniciarCLP(req, res) {
  try {
    const opcua = new OpcuaService()
    await opcua.connect()
    await opcua.iniciarProducao()
    await opcua.disconnect()

    res.json({ message: 'CLP iniciado com sucesso!' })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao iniciar CLP', detalhe: err.message })
  }
}

async function pararCLP(req, res) {
  try {
    const opcua = new OpcuaService()
    await opcua.connect()
    await opcua.abortarPedido()
    await opcua.disconnect()

    res.json({ message: 'CLP parado com sucesso!' })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao parar CLP', detalhe: err.message })
  }
}

async function statusCLP(req, res) {
  try {
    const opcua = new OpcuaService()
    await opcua.connect()
    const status = await opcua.lerStatus()
    await opcua.disconnect()

    res.json({ status })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar status do CLP', detalhe: err.message })
  }
}

module.exports = { atualizarStatusCLP, iniciarCLP, pararCLP, statusCLP }
