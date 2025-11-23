const express = require('express')
const { criarAdmin, listarAdmins, excluirAdmin } = require('../controllers/adminController.js')
const estoqueController = require('../controllers/estoqueController.js')
const autenticarToken = require('../middleware/auth.js')
const verificarAdmin = require('../middleware/verificarAdmin.js')
const verificarSuperAdmin = require('../middleware/verificarSuperAdmin.js')
// Se tiver rotas de CLP, mantenha. Se não, pode remover:
const clpController = require('../controllers/clpController')
const { listarPedidosSuperadmin } = require('../controllers/pedidoController.js')

const router = express.Router()

// Todas as rotas de admin exigem autenticação
router.use(autenticarToken)

// 👑 Rotas exclusivas do Superadmin
router.post('/criar', verificarSuperAdmin, criarAdmin)
router.delete('/excluir/:id', verificarSuperAdmin, excluirAdmin)
// 📋 Listar pedidos (superadmin)
router.get('/pedidos', verificarSuperAdmin, listarPedidosSuperadmin)

// 📋 Rotas acessíveis por admin e superadmin
router.get('/listar', verificarAdmin, listarAdmins)

// 📦 Rotas de Estoque (unificada)
router.post('/estoque/repor', verificarAdmin, estoqueController.reporEstoqueEPedido)

// ⚙️ Rotas de CLP (se necessário)
router.post('/clp/iniciar', verificarAdmin, clpController.iniciarCLP)
router.post('/clp/parar', verificarAdmin, clpController.pararCLP)
router.get('/clp/status', verificarAdmin, clpController.statusCLP)

module.exports = router
