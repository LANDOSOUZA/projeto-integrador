// utils/criarAdminBase.js
const bcrypt = require('bcrypt')
const Cliente = require('../models/Cliente')

async function criarAdminBase() {
  try {
    // Apaga qualquer admin existente
    await Cliente.deleteMany({ email: "landosouza@sucos.com" })

    const senhaHash = await bcrypt.hash('@L11Lando02025', 10)

    const novoAdmin = new Cliente({
      nome: "Lando Souza",
      email: "landosouza@sucos.com",
      senha: "@L11Lando02025", // texto puro
      status: "admin"
    })

    await novoAdmin.save()
    console.log("✅ Admin recriado com sucesso:", novoAdmin.email, "código:", novoAdmin.codigo)
  } catch (err) {
    console.error("❌ Erro ao criar admin base:", err)
  }
}

module.exports = criarAdminBase
