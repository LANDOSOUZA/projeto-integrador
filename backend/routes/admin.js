// 📂 src/routes/admin.js
import express from 'express'
import { criarAdmin, listarAdmins, excluirAdmin } from '../controllers/adminController.js'
import autenticarToken from '../middleware/auth.js'
import verificarAdmin from '../middleware/verificarAdmin.js'
import verificarSuperAdmin from '../middleware/verificarSuperAdmin.js'

const router = express.Router()

// Todas as rotas de admin exigem autenticação
router.use(autenticarToken)

// 👑 Rotas exclusivas do Superadmin
router.post('/criar', verificarSuperAdmin, criarAdmin)           // Criar novo admin ou superadmin
router.delete('/excluir/:id', verificarSuperAdmin, excluirAdmin) // Excluir admin por ID

// 📋 Rotas acessíveis por admin e superadmin
router.get('/listar', verificarAdmin, listarAdmins)              // Listar todos os admins e superadmins

export default router
