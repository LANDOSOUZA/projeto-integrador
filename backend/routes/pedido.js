const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const autenticarToken = require('../middleware/auth');

// Middleware opcional para rotas de admin
function apenasAdmin(req, res, next) {
  if (req.cliente.perfil !== 'admin') {
    return res.status(403).json({ mensagem: 'Acesso restrito a administradores' });
  }
  next();
}

// 📦 Cadastrar pedido (protegida)
router.post('/', autenticarToken, pedidoController.cadastrarPedido);

// 📋 Listar pedidos do cliente (protegida)
router.get('/', autenticarToken, pedidoController.listarPedidos);

// ❌ Cancelar pedido (protegida)
router.delete('/:id', autenticarToken, pedidoController.cancelarPedido);

// 🕓 Histórico de pedidos (protegida)
router.get('/historico', autenticarToken, pedidoController.historicoPedidos);

// 🛠️ Listar todos os pedidos (admin)
router.get('/admin/todos', autenticarToken, apenasAdmin, pedidoController.listarTodosPedidos);

// 📊 Gerar balancete por período (admin)
router.get('/balancete', autenticarToken, apenasAdmin, pedidoController.gerarBalancete);


module.exports = router;

