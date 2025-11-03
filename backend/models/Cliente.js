const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const clienteSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    unique: true
  },
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  senha: {
    type: String,
    required: true
  },
  // 👇 Campo padronizado para diferenciar cliente comum e admin
  status: {
    type: String,
    enum: ['usuario', 'admin'],
    default: 'usuario'
  }
}, { timestamps: true })

// Antes de salvar, gera hash da senha
clienteSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next()
  this.senha = await bcrypt.hash(this.senha, 10)
  next()
})

// Método para comparar senha
clienteSchema.methods.compararSenha = async function (senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha)
}

module.exports = mongoose.model('Cliente', clienteSchema)
