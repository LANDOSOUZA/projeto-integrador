// 📂 src/routes/cliente.js
import express from 'express'
import * as clienteController from '../controllers/clienteController.js'
import autenticarToken from '../middleware/auth.js'
import verificarAdmin from '../middleware/verificarAdmin.js'

const router = express.Router()

// Cadastro de novo cliente (público)
router.post('/cadastrar', clienteController.cadastrarCliente)

// Login do cliente (público)
router.post('/login', clienteController.loginCliente)

// Perfil do cliente logado
router.get('/perfil', autenticarToken, (req, res) => {
  const { id, nome, email, status } = req.user
  res.status(200).json({
    mensagem: 'Perfil acessado com sucesso',
    clienteId: id,
    nome,
    email,
    status
  })
})

// Listar todos os clientes (somente admin/superadmin)
router.get('/todos', autenticarToken, verificarAdmin, clienteController.listarClientes)

// Atualizar papel (role) de um cliente
router.put('/:id/role', autenticarToken, verificarAdmin, clienteController.atualizarRole)

// Atualizar status de um cliente
router.put('/:id/status', autenticarToken, verificarAdmin, clienteController.atualizarStatus)

// Excluir cliente
router.delete('/:id', autenticarToken, verificarAdmin, clienteController.excluirCliente)

export default router
