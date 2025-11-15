const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const ClienteSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['usuario', 'admin', 'superadmin'], // ✅ agora aceita superadmin
    default: 'usuario'
  }
}, { timestamps: true })

// 🔐 Antes de salvar, se a senha foi modificada, gera o hash automaticamente
ClienteSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next()
  this.senha = await bcrypt.hash(this.senha, 10)
  next()
})

// 🔐 Método para comparar senha digitada com o hash
ClienteSchema.methods.compararSenha = async function (senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha)
}

module.exports = mongoose.model('Cliente', ClienteSchema)
