// utils/criarAdminBase.js
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

    // Cria novo admin com senha pura (o hook do schema vai hashá-la)
    const novoAdmin = new Cliente({
      codigo: 1,                // superadmin inicial sempre com código 1
      nome: "Lando Souza",
      email: emailAdmin,
      senha: senhaAdmin,        // senha pura, será hashada pelo pre('save')
      status: "superadmin"
    })

    await novoAdmin.save()
    console.log("✅ Admin root criado com sucesso:", novoAdmin.email)
  } catch (err) {
    console.error("❌ Erro ao criar admin base:", err)
  }
}

module.exports = criarAdminBase
