const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const autenticarToken = require('../middleware/auth');

// 🔒 Middleware para rotas de admin
function apenasAdmin(req, res, next) {
  if (req.user?.status !== 'admin') {
    return res.status(403).json({ mensagem: 'Acesso restrito a administradores' });
  }
  next();
}

// ========================
// 🔧 Rotas Administrativas
// ========================

// 📋 Listar todos os pedidos
router.get('/admin', autenticarToken, apenasAdmin, pedidoController.listarTodosPedidosAdmin);

// ⏩ Antecipar pedido
router.put('/admin/antecipar/:id', autenticarToken, apenasAdmin, pedidoController.anteciparPedido);

// 🗑️ Excluir todos os pedidos de um cliente pelo código
router.delete('/admin/excluir/:codigoCliente', autenticarToken, apenasAdmin, pedidoController.excluirPedidosClienteAdmin);

// 🧹 Limpar todos os pedidos
router.delete('/admin/limpar', autenticarToken, apenasAdmin, pedidoController.limparPedidos);

// ========================
// 📦 Rotas de Cliente
// ========================

// Cadastrar pedido (cliente logado)
router.post('/', autenticarToken, pedidoController.cadastrarPedido);

// Listar pedidos do cliente logado
router.get('/', autenticarToken, pedidoController.listarPedidos);

// Histórico de pedidos do cliente logado
router.get('/historico', autenticarToken, pedidoController.historicoPedidos);

// ❌ Cancelar pedido do cliente logado (rota genérica, fica por último)
router.delete('/:id', autenticarToken, pedidoController.cancelarPedido);

module.exports = router;
