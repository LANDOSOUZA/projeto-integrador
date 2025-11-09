const express = require('express')
const router = express.Router()
const produtoController = require('../controllers/produtoController')
const autenticarToken = require('../middleware/auth')
const verificarAdmin = require('../middleware/verificarAdmin')

// Rota pública para listar produtos
router.get('/', produtoController.listarProdutos)

// Buscar produto por id sequencial
router.get('/:id', produtoController.buscarProduto)

// Rotas protegidas (admin)
router.post('/cadastrar', autenticarToken, verificarAdmin, produtoController.cadastrarProduto)
router.put('/:id', autenticarToken, verificarAdmin, produtoController.atualizarProduto)
router.patch('/:id/status', autenticarToken, verificarAdmin, produtoController.atualizarStatusProduto)
router.delete('/:id', autenticarToken, verificarAdmin, produtoController.excluirProduto)

module.exports = router
