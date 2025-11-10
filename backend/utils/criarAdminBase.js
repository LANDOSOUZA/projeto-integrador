// utils/criarAdminBase.js
const bcrypt = require('bcrypt')
const Cliente = require('../models/Cliente')

async function criarAdminBase() {
  try {
    const emailAdmin = "landosouza@sucos.com"
    const senhaAdmin = "@L11Lando02025"

    // Verifica se já existe admin com esse email
    const existente = await Cliente.findOne({ email: emailAdmin })
    if (existente) {
      console.log("⚡ Admin já existe:", existente.email)
      return
    }

    // Cria hash da senha
    const senhaHash = await bcrypt.hash(senhaAdmin, 10)

    // Cria novo admin com senha hash
    const novoAdmin = new Cliente({
      nome: "Lando Souza",
      email: emailAdmin,
      senha: senhaHash,   // importante: salvar o hash
      status: "superadmin"
    })

    await novoAdmin.save()
    console.log("✅ Admin root criado com sucesso:", novoAdmin.email)
  } catch (err) {
    console.error("❌ Erro ao criar admin base:", err)
  }
}

module.exports = criarAdminBase
