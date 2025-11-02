const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const autenticarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/verificarAdmin');

// 🔓 Rota pública para listar produtos
router.get('/', produtoController.listarProdutos);

// 🔐 Rotas protegidas por autenticação e perfil admin
router.post('/cadastrar', autenticarToken, verificarAdmin, produtoController.cadastrarProduto);
router.put('/:id', autenticarToken, verificarAdmin, produtoController.atualizarProduto);
router.delete('/:id', autenticarToken, verificarAdmin, produtoController.excluirProduto);

module.exports = router;
