const Produto = require('../models/Produto.js')
const STATUS = { EM_PROCESSAMENTO: 'em_processamento', PROCESSANDO: 'processando' }

const { atualizarStatusPedido } = require('./pedidoController')

async function reporEstoqueEPedido(req, res) {
  try {
    const { produtoId, pedidoId } = req.body

    // Atualiza estoque
    const produto = await Produto.findById(produtoId)
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' })
    produto.quantidade += 3
    await produto.save()

    // Reaproveita a lógica de atualizar status
    req.params.id = pedidoId
    req.body.status = STATUS.EM_PROCESSAMENTO
    return atualizarStatusPedido(req, res)

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
