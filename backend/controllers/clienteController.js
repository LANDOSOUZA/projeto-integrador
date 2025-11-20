const Cliente = require('../models/Cliente')
const jwt = require('jsonwebtoken')

// 🧾 Cadastrar novo cliente (rota pública)
const cadastrarCliente = async (req, res) => {
  try {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Nome, e-mail e senha são obrigatórios' })
    }

    const existente = await Cliente.findOne({ email })
    if (existente) {
      return res.status(400).json({ mensagem: 'Já existe um cliente com esse e-mail' })
    }

    const ultimo = await Cliente.findOne().sort('-codigo')
    const codigo = ultimo ? ultimo.codigo + 1 : 1

    const novoCliente = new Cliente({
      codigo,
      nome,
      email,
      senha,
      status: 'usuario',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await novoCliente.save()

    const token = jwt.sign(
      {
        id: novoCliente._id,
        codigo: novoCliente.codigo,
        nome: novoCliente.nome,
        email: novoCliente.email,
        status: novoCliente.status
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.status(201).json({
      mensagem: 'Cliente cadastrado com sucesso',
      token,
      user: {
        id: novoCliente._id,
        codigo: novoCliente.codigo,
        nome: novoCliente.nome,
        email: novoCliente.email,
        status: novoCliente.status
      }
    })
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao cadastrar cliente', erro: err.message })
  }
}

// 🔑 Login de cliente
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

    if (!(await cliente.compararSenha(senha))) {
      return res.status(401).json({ mensagem: 'Senha inválida' })
    }

    const payload = {
      id: cliente._id,
      codigo: cliente.codigo,
      nome: cliente.nome,
      email: cliente.email,
      status: cliente.status
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })

    res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      token,
      user: payload
    })
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao realizar login', erro: err.message })
  }
}

// 📋 Listar todos os clientes (apenas admin/superadmin)
const listarClientes = async (req, res) => {
  try {
    const statusAtual = req.user?.status
    if (statusAtual !== 'admin' && statusAtual !== 'superadmin') {
      return res.status(403).json({ mensagem: 'Apenas administradores podem listar clientes.' })
    }

    const clientes = await Cliente.find().select('-senha').sort({ codigo: 1 })
    res.status(200).json({ usuarios: clientes }) // ✅ retorna como "usuarios"
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao listar clientes', erro: err.message })
  }
}

// ⚡ Atualizar papel (role)
const atualizarRole = async (req, res) => {
  try {
    const { id } = req.params
    const { role } = req.body
    const cliente = await Cliente.findByIdAndUpdate(id, { role }, { new: true }).select('-senha')
    if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado' })
    res.json({ mensagem: 'Role atualizado com sucesso', cliente })
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao atualizar role', erro: err.message })
  }
}

// ⚡ Atualizar status
const atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const cliente = await Cliente.findByIdAndUpdate(id, { status }, { new: true }).select('-senha')
    if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado' })
    res.json({ mensagem: 'Status atualizado com sucesso', cliente })
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao atualizar status', erro: err.message })
  }
}

// ❌ Excluir cliente
const excluirCliente = async (req, res) => {
  try {
    const { id } = req.params
    const cliente = await Cliente.findByIdAndDelete(id)
    if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado' })
    res.json({ mensagem: 'Cliente excluído com sucesso' })
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao excluir cliente', erro: err.message })
  }
}

module.exports = {
  cadastrarCliente,
  loginCliente,
  listarClientes,
  atualizarRole,
  atualizarStatus,
  excluirCliente
}
