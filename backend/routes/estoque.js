// 📂 src/routes/estoque.js
const express = require('express')
const router = express.Router()
const estoqueController = require('../controllers/estoqueController')
const autenticarToken = require('../middleware/auth')
const verificarAdmin = require('../middleware/verificarAdmin')

// 🔒 Rotas de Estoque (somente admin)
router.get('/estoque', autenticarToken, verificarAdmin, estoqueController.listarEstoque)
router.post('/estoque/repor', autenticarToken, verificarAdmin, estoqueController.reporEstoqueEPedido)


module.exports = router

