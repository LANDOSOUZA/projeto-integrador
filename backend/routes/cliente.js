const express = require('express')
const router = express.Router()
const clienteController = require('../controllers/clienteController')
const autenticarToken = require('../middleware/auth')
const verificarAdmin = require('../middleware/verificarAdmin')

// Cadastro de novo cliente (público)
router.post('/cadastrar', clienteController.cadastrarCliente)

// Login do cliente (público)
router.post('/login', clienteController.loginCliente)

// Perfil do cliente logado
router.get('/perfil', autenticarToken, (req, res) => {
  const { id, nome, email, perfil } = req.user
  res.status(200).json({ mensagem: 'Perfil acessado com sucesso', clienteId: id, nome, email, perfil })
})

// Listar todos os clientes (somente admin)
router.get('/todos', autenticarToken, verificarAdmin, clienteController.listarClientes)

module.exports = router
