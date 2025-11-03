const Cliente = require('../models/Cliente')
const jwt = require('jsonwebtoken')

// 🧾 Cadastrar novo cliente
const cadastrarCliente = async (req, res) => {
  try {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Nome, e-mail e senha são obrigatórios' })
    }

    // Verifica se já existe cliente com esse e-mail
    const existente = await Cliente.findOne({ email })
    if (existente) {
      return res.status(400).json({ mensagem: 'Já existe um cliente com esse e-mail' })
    }

    // Gera código sequencial automaticamente
    const ultimo = await Cliente.findOne().sort('-codigo')
    const codigo = ultimo ? ultimo.codigo + 1 : 1

    const novoCliente = new Cliente({
      codigo,
      nome,
      email,
      senha,
      status: 'usuario'
    })


    await novoCliente.save()

    res.status(201).json({
      mensagem: 'Cliente cadastrado com sucesso',
      cliente: {
        id: novoCliente._id,
        codigo: novoCliente.codigo,
        nome: novoCliente.nome,
        email: novoCliente.email,
        status: novoCliente.status
      }
    })
  } catch (err) {
    console.error('❌ Erro ao cadastrar cliente:', err)
    res.status(500).json({ mensagem: 'Erro ao cadastrar cliente', erro: err.message })
  }
}

// 🔐 Login do cliente (corrigido)
const loginCliente = async (req, res) => {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios' })
    }

    const cliente = await Cliente.findOne({ email })
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' })
    }

    const senhaValida = await cliente.compararSenha(senha)
    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Senha inválida' })
    }

    // Gera token JWT com payload básico
    const token = jwt.sign(
      {
        id: cliente._id,
        codigo: cliente.codigo,
        nome: cliente.nome,
        email: cliente.email,
        status: cliente.status
      },
      process.env.JWT_SECRET || 'segredo',
      { expiresIn: '24h' }
    )

    // 🔹 Agora retorna também os dados do cliente
    res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      token,
      cliente: {
        id: cliente._id,
        codigo: cliente.codigo,
        nome: cliente.nome,
        email: cliente.email,
        status: cliente.status
      }
    })
  } catch (err) {
    console.error('❌ Erro no login:', err)
    res.status(500).json({ mensagem: 'Erro ao realizar login', erro: err.message })
  }
}


// 📋 Listar todos os clientes (apenas admin)
const listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().select('-senha').sort({ codigo: 1 })
    res.status(200).json({ clientes })
  } catch (err) {
    console.error('❌ Erro ao listar clientes:', err)
    res.status(500).json({ mensagem: 'Erro ao listar clientes', erro: err.message })
  }
}

module.exports = {
  cadastrarCliente,
  loginCliente,
  listarClientes
}
