const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const autenticarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/verificarAdmin');

// 🧾 Cadastro de novo cliente (público)
router.post('/cadastrar', clienteController.cadastrarCliente);

// 🔐 Login do cliente (público)
router.post('/login', clienteController.loginCliente);

// 🔒 Verificação de perfil do cliente logado (protegido)
router.get('/perfil', autenticarToken, (req, res) => {
  const { id, nome, email, status } = req.cliente;

  res.status(200).json({
    mensagem: 'Perfil acessado com sucesso',
    clienteId: id,
    nome,
    email,
    status
  });
});

// 📋 Listar todos os clientes cadastrados (somente ADMIN)
router.get('/todos', autenticarToken, verificarAdmin, clienteController.listarClientes);

module.exports = router;
