const Usuario = require('../models/Cliente')
const bcrypt = require('bcrypt')

// Criar novo admin ou superadmin
async function criarAdmin(req, res) {
  try {
    const statusAtual = req.user?.status
    if (statusAtual !== 'superadmin') {
      return res.status(403).json({ mensagem: 'Apenas o superadmin pode criar outros admins.' })
    }

    const { nome, email, senha, status } = req.body

    // Validação básica
    if (!nome || !email || !senha || !status) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' })
    }

    // Permitir apenas admin ou superadmin
    const statusPermitidos = ['admin', 'superadmin']
    if (!statusPermitidos.includes(status)) {
      return res.status(400).json({ mensagem: 'Status inválido.' })
    }

    // ⚠️ Não aplicar bcrypt.hash aqui — o modelo já faz isso no pre('save')
    const novoAdmin = new Usuario({
      nome,
      email,
      senha,   // texto puro, o modelo aplica hash
      status
    })

    await novoAdmin.save()
    res.status(201).json({ mensagem: `Novo ${status} criado com sucesso`, admin: novoAdmin })
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar admin', erro: err.message })
  }
}

// Listar todos os admins e superadmins
async function listarAdmins(req, res) {
  try {
    const statusAtual = req.user?.status
    if (statusAtual !== 'admin' && statusAtual !== 'superadmin') {
      return res.status(403).json({ mensagem: 'Apenas administradores podem listar admins.' })
    }

    const admins = await Usuario.find({ status: { $in: ['admin', 'superadmin'] } })
    res.status(200).json({ admins })
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao listar admins', erro: err.message })
  }
}

// Excluir admin
async function excluirAdmin(req, res) {
  try {
    const statusAtual = req.user?.status
    if (statusAtual !== 'superadmin') {
      return res.status(403).json({ mensagem: 'Apenas o superadmin pode excluir admins.' })
    }

    const { id } = req.params
    await Usuario.findByIdAndDelete(id)
    res.status(200).json({ mensagem: 'Admin excluído com sucesso' })
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao excluir admin', erro: err.message })
  }
}

module.exports = {
  criarAdmin,
  listarAdmins,
  excluirAdmin
}
