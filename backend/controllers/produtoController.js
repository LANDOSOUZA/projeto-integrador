const db = require('../database/conexao');

// 🧾 Cadastrar novo produto
const cadastrarProduto = (req, res) => {
  const { nome, preco, quantidade } = req.body;

  if (!nome || !preco || !quantidade) {
    return res.status(400).json({ mensagem: 'Nome, preço e quantidade são obrigatórios' });
  }

  db.run(
    `INSERT INTO produto (nome, preco, quantidade) VALUES (?, ?, ?)`,
    [nome, preco, quantidade],
    function (err) {
      if (err) {
        return res.status(500).json({ mensagem: 'Erro ao cadastrar produto' });
      }

      res.status(201).json({ mensagem: 'Produto cadastrado com sucesso', id: this.lastID });
    }
  );
};

// 📋 Listar todos os produtos
const listarProdutos = (req, res) => {
  db.all(`SELECT * FROM produto`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ mensagem: 'Erro ao listar produtos' });
    }

    res.status(200).json({ produtos: rows });
  });
};

// ✏️ Atualizar produto
const atualizarProduto = (req, res) => {
  const { id } = req.params;
  const { nome, preco, quantidade } = req.body;

  db.run(
    `UPDATE produto SET nome = ?, preco = ?, quantidade = ? WHERE id = ?`,
    [nome, preco, quantidade, id],
    function (err) {
      if (err) {
        return res.status(500).json({ mensagem: 'Erro ao atualizar produto' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ mensagem: 'Produto não encontrado' });
      }

      res.status(200).json({ mensagem: 'Produto atualizado com sucesso' });
    }
  );
};

// 🗑️ Excluir produto
const excluirProduto = (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM produto WHERE id = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({ mensagem: 'Erro ao excluir produto' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    res.status(200).json({ mensagem: 'Produto excluído com sucesso' });
  });
};

module.exports = {
  cadastrarProduto,
  listarProdutos,
  atualizarProduto,
  excluirProduto
};
