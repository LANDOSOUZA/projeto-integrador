const express = require('express')
const router = express.Router()
const pedidoController = require('../controllers/pedidoController')
const autenticarToken = require('../middleware/auth')

// Middleware para rotas de admin
function apenasAdmin(req, res, next) {
  const isAdmin = req.user?.perfil === 'admin' || req.user?.status === 'admin'
  if (!isAdmin) {
    return res.status(403).json({ mensagem: 'Acesso restrito a administradores' })
  }
  next()
}


// ========================
// Rotas Administrativas
// ========================
router.get('/admin', autenticarToken, apenasAdmin, pedidoController.listarTodosPedidosAdmin)
router.put('/admin/antecipar/:id', autenticarToken, apenasAdmin, pedidoController.anteciparPedido)
router.delete('/admin/excluir/:codigoCliente', autenticarToken, apenasAdmin, pedidoController.excluirPedidosClienteAdmin)
router.delete('/admin/limpar', autenticarToken, apenasAdmin, pedidoController.limparPedidos)
router.get('/admin/balancete', autenticarToken, apenasAdmin, pedidoController.gerarBalancete)

// ========================
// Rotas de Cliente
// ========================
router.post('/', autenticarToken, pedidoController.cadastrarPedido)
router.get('/', autenticarToken, pedidoController.listarPedidos)
router.get('/historico', autenticarToken, pedidoController.historicoPedidos)
router.patch('/:id/cancelar', autenticarToken, pedidoController.cancelarPedido)

// Finalizar pedido (novo)
router.patch('/:id/finalizar', autenticarToken, pedidoController.finalizarPedido)

// Limpar pedidos do cliente logado (novo)
router.delete('/limpar', autenticarToken, pedidoController.limparPedidosCliente)

// ========================
// Rotas do MES
// ========================
router.put('/mes/reordenar/:pedidoId', autenticarToken, pedidoController.reordenarFilaMES)

module.exports = router
