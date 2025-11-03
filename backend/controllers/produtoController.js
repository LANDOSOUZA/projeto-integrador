const Produto = require('../models/Produto')

// 🧾 Cadastrar novo produto
const cadastrarProduto = async (req, res) => {
  try {
    const { nome, preco, quantidade, status, peso, descricao } = req.body

    if (!nome || preco == null) {
      return res.status(400).json({ mensagem: 'Nome e preço são obrigatórios' })
    }

    // Busca o maior id atual
    const ultimo = await Produto.findOne().sort({ id: -1 })
    const proximoId = ultimo ? ultimo.id + 1 : 1

    const novoProduto = new Produto({
      id: proximoId,
      nome,
      peso,
      descricao,
      preco,
      quantidade: quantidade || 0,
      status: status || 'ativo'
    })

    await novoProduto.save()

    res.status(201).json({
      mensagem: 'Produto cadastrado com sucesso',
      produto: novoProduto
    })
  } catch (err) {
    console.error('❌ Erro ao cadastrar produto:', err)
    res.status(500).json({ mensagem: 'Erro ao cadastrar produto', erro: err.message })
  }
}

// 📋 Listar todos os produtos
const listarProdutos = async (req, res) => {
  try {
    const produtos = await Produto.find().sort({ id: 1 })
    res.status(200).json({ produtos })
  } catch (err) {
    console.error('❌ Erro ao listar produtos:', err)
    res.status(500).json({ mensagem: 'Erro ao listar produtos', erro: err.message })
  }
}

// 🔍 Buscar produto por id sequencial
const buscarProduto = async (req, res) => {
  try {
    const { id } = req.params
    const produto = await Produto.findOne({ id: parseInt(id) })

    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' })
    }

    res.status(200).json({ produto })
  } catch (err) {
    console.error('❌ Erro ao buscar produto:', err)
    res.status(500).json({ mensagem: 'Erro ao buscar produto', erro: err.message })
  }
}

// ✏️ Atualizar dados do produto
const atualizarProduto = async (req, res) => {
  try {
    const { id } = req.params
    const { nome, preco, quantidade, peso, descricao } = req.body

    const produto = await Produto.findOneAndUpdate(
      { id: parseInt(id) },
      { nome, preco, quantidade, peso, descricao },
      { new: true }
    )

    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' })
    }

    res.status(200).json({
      mensagem: 'Produto atualizado com sucesso',
      produto
    })
  } catch (err) {
    console.error('❌ Erro ao atualizar produto:', err)
    res.status(500).json({ mensagem: 'Erro ao atualizar produto', erro: err.message })
  }
}

// 🔄 Atualizar status do produto
const atualizarStatusProduto = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const statusValidos = ['ativo', 'inativo']
    if (!statusValidos.includes(status)) {
      return res.status(400).json({ mensagem: 'Status inválido. Use: ativo ou inativo' })
    }

    const produto = await Produto.findOneAndUpdate(
      { id: parseInt(id) },
      { status },
      { new: true }
    )

    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' })
    }

    res.status(200).json({
      mensagem: `Status atualizado para ${status}`,
      produto
    })
  } catch (err) {
    console.error('❌ Erro ao atualizar status do produto:', err)
    res.status(500).json({ mensagem: 'Erro ao atualizar status do produto', erro: err.message })
  }
}

// 🗑️ Excluir produto
const excluirProduto = async (req, res) => {
  try {
    const { id } = req.params
    const produto = await Produto.findOneAndDelete({ id: parseInt(id) })

    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' })
    }

    res.status(200).json({ mensagem: 'Produto excluído com sucesso' })
  } catch (err) {
    console.error('❌ Erro ao excluir produto:', err)
    res.status(500).json({ mensagem: 'Erro ao excluir produto', erro: err.message })
  }
}

module.exports = {
  cadastrarProduto,
  listarProdutos,
  buscarProduto, // 👈 incluímos aqui
  atualizarProduto,
  atualizarStatusProduto,
  excluirProduto
}
