const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const autenticarToken = require('../middleware/auth');

// 🔒 Middleware para rotas de admin
function apenasAdmin(req, res, next) {
  if (req.cliente?.status !== 'admin') {
    return res.status(403).json({ mensagem: 'Acesso restrito a administradores' });
  }
  next();
}

// 📦 Cadastrar pedido (cliente logado)
router.post('/', autenticarToken, pedidoController.cadastrarPedido);

// 📋 Listar pedidos do cliente logado
router.get('/', autenticarToken, pedidoController.listarPedidos);

// ❌ Cancelar pedido do cliente logado
// Aqui o :id continua sendo o _id do pedido, mas a verificação de dono é feita pelo codigo do cliente
router.delete('/:id', autenticarToken, pedidoController.cancelarPedido);

// ❌ Excluir todos os pedidos de um cliente pelo código (admin)
router.delete(
  '/admin/pedidos/cliente/:codigo',
  autenticarToken,
  apenasAdmin,
  pedidoController.excluirPedidosPorCodigo
);

// 🕓 Histórico de pedidos do cliente logado
router.get('/historico', autenticarToken, pedidoController.historicoPedidos);

// 🛠️ Listar todos os pedidos (somente admin)
router.get('/admin/todos', autenticarToken, apenasAdmin, pedidoController.listarTodosPedidos);

// 📊 Gerar balancete por período (somente admin)
router.get('/balancete', autenticarToken, apenasAdmin, pedidoController.gerarBalancete);

// 🧹 Limpar todos os pedidos (somente admin)
router.delete('/limpar', autenticarToken, apenasAdmin, pedidoController.limparPedidos);

module.exports = router;

