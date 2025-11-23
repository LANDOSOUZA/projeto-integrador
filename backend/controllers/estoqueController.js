const Produto = require('../models/Produto.js')
const Pedido = require('../models/Pedido.js')

async function reporEstoqueEPedido(req, res) {
  try {
    const { produtoId, pedidoId } = req.body

    // Atualiza estoque
    const produto = await Produto.findById(produtoId)
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' })
    produto.quantidade += 3
    await produto.save()

    // Atualiza status do pedido
    const pedido = await Pedido.findById(pedidoId)
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' })
    pedido.status = 'em_processamento'
    await pedido.save()

    res.json({
      message: `Inserido três sucos de ${produto.nome} no estoque. Pedido ${pedido._id} atualizado para em_processamento.`
    })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao repor estoque e atualizar pedido' })
  }
}

// ➕ Nova função para listar o estoque
async function listarEstoque(req, res) {
  try {
    const produtos = await Produto.find()
    res.json(produtos)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar estoque' })
  }
}

module.exports = { reporEstoqueEPedido, listarEstoque }
