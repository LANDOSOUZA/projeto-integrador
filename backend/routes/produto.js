// 📂 src/routes/produto.js
const express = require('express')
const router = express.Router()
const produtoController = require('../controllers/produtoController')
const autenticarToken = require('../middleware/auth')
const verificarAdmin = require('../middleware/verificarAdmin')

// 📦 Rotas públicas (catálogo)
router.get('/', produtoController.listarProdutos)          // Listar todos os produtos
router.get('/:id', produtoController.buscarProduto)        // Buscar produto por ID sequencial

// 🔒 Rotas protegidas (somente admin)
router.post('/cadastrar', autenticarToken, verificarAdmin, produtoController.cadastrarProduto)   // Cadastrar novo produto
router.put('/:id', autenticarToken, verificarAdmin, produtoController.atualizarProduto)          // Atualizar produto
router.patch('/:id/status', autenticarToken, verificarAdmin, produtoController.atualizarStatusProduto) // Atualizar status (ativo/inativo)
router.delete('/:id', autenticarToken, verificarAdmin, produtoController.excluirProduto)         // Excluir produto

module.exports = router
