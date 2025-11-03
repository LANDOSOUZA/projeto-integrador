const express = require('express')
const router = express.Router()
const produtoController = require('../controllers/produtoController')
const autenticarToken = require('../middleware/auth')
const verificarAdmin = require('../middleware/verificarAdmin')

// 🔓 Rota pública para listar produtos
router.get('/', produtoController.listarProdutos)

// 🔓 Rota pública para buscar produto por id sequencial
router.get('/:id', produtoController.buscarProduto) // 👈 adicionei essa rota

// 🔐 Rotas protegidas por autenticação e perfil admin
router.post('/cadastrar', autenticarToken, verificarAdmin, produtoController.cadastrarProduto)
router.put('/:id', autenticarToken, verificarAdmin, produtoController.atualizarProduto)
router.patch('/:id/status', autenticarToken, verificarAdmin, produtoController.atualizarStatusProduto)
router.delete('/:id', autenticarToken, verificarAdmin, produtoController.excluirProduto)

module.exports = router

