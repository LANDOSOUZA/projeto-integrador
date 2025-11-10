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
  const { id, nome, email, perfil } = req.user
  res.status(200).json({
    mensagem: 'Perfil acessado com sucesso',
    clienteId: id,
    nome,
    email,
    perfil
  })
})

// Listar todos os clientes (somente admin)
router.get('/todos', autenticarToken, verificarAdmin, clienteController.listarClientes)

export default router
