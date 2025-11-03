const express = require('express')
const router = express.Router()
const pedidoController = require('../controllers/pedidoController')
const autenticarToken = require('../middleware/auth')

// 🔒 Middleware para rotas de admin
function apenasAdmin(req, res, next) {
  if (req.user?.perfil !== 'admin') {
    return res.status(403).json({ mensagem: 'Acesso restrito a administradores' })
  }
  next()
}

// ========================
// 🔧 Rotas Administrativas
// ========================

// 📋 Listar todos os pedidos
router.get('/admin', autenticarToken, apenasAdmin, pedidoController.listarTodosPedidosAdmin)

// ⏩ Antecipar pedido
router.put('/admin/antecipar/:id', autenticarToken, apenasAdmin, pedidoController.anteciparPedido)

// 🗑️ Excluir todos os pedidos de um cliente pelo código
router.delete('/admin/excluir/:codigoCliente', autenticarToken, apenasAdmin, pedidoController.excluirPedidosClienteAdmin)

// 🧹 Limpar todos os pedidos
router.delete('/admin/limpar', autenticarToken, apenasAdmin, pedidoController.limparPedidos)

// 📊 Gerar balancete
router.get('/admin/balancete', autenticarToken, apenasAdmin, pedidoController.gerarBalancete)

// ========================
// 📦 Rotas de Cliente
// ========================

// Cadastrar pedido (cliente logado)
router.post('/', autenticarToken, pedidoController.cadastrarPedido)

// Listar pedidos do cliente logado
router.get('/', autenticarToken, pedidoController.listarPedidos)

// Histórico de pedidos do cliente logado
router.get('/historico', autenticarToken, pedidoController.historicoPedidos)

// ❌ Cancelar pedido do cliente logado
router.patch('/:id/cancelar', autenticarToken, pedidoController.cancelarPedido)

// ========================
// 🔄 Rotas do MES
// ========================

// Reordenar fila (MES)
router.put('/mes/reordenar/:pedidoId', autenticarToken, pedidoController.reordenarFilaMES)


module.exports = router
