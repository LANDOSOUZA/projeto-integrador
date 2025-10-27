const Produto = require('../models/Produto');

// 🧾 Cadastrar novo produto
const cadastrarProduto = async (req, res) => {
  try {
    const { nome, preco, quantidade } = req.body;

    if (!nome || !preco || !quantidade) {
      return res.status(400).json({ mensagem: 'Nome, preço e quantidade são obrigatórios' });
    }

    const novoProduto = new Produto({
      nome,
      preco,
      quantidade,
      status: 'iniciado' // status inicial
    });

    await novoProduto.save();

    res.status(201).json({
      mensagem: 'Produto cadastrado com sucesso',
      produto: novoProduto
    });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao cadastrar produto' });
  }
};

// 📋 Listar todos os produtos
const listarProdutos = async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.status(200).json({ produtos });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao listar produtos' });
  }
};

// ✏️ Atualizar dados do produto (nome, preço, quantidade)
const atualizarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, quantidade } = req.body;

    const produto = await Produto.findByIdAndUpdate(
      id,
      { nome, preco, quantidade },
      { new: true }
    );

    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    res.status(200).json({
      mensagem: 'Produto atualizado com sucesso',
      produto
    });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao atualizar produto' });
  }
};

// 🔄 Atualizar status do produto
const atualizarStatusProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const statusValidos = ['iniciado', 'em_processamento', 'pronto'];
    if (!statusValidos.includes(status)) {
      return res.status(400).json({ mensagem: 'Status inválido' });
    }

    const produto = await Produto.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    res.status(200).json({
      mensagem: `Status atualizado para ${status}`,
      produto
    });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao atualizar status do produto' });
  }
};

// 🗑️ Excluir produto
const excluirProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await Produto.findByIdAndDelete(id);

    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    res.status(200).json({ mensagem: 'Produto excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao excluir produto' });
  }
};

module.exports = {
  cadastrarProduto,
  listarProdutos,
  atualizarProduto,
  atualizarStatusProduto,
  excluirProduto
};
