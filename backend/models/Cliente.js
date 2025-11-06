// models/Cliente.js
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Counter = require('./Counter')

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
  status: {
    type: String,
    enum: ['usuario', 'admin'],
    default: 'usuario'
  }
}, { timestamps: true })

// 🔑 Antes de salvar, gera código sequencial por status
clienteSchema.pre('save', async function (next) {
  if (this.isNew) {
    const contador = await Counter.findOneAndUpdate(
      { nome: this.status },          // chave = status
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )
    this.codigo = contador.seq
  }

  // Hash da senha
  if (this.isModified('senha')) {
    this.senha = await bcrypt.hash(this.senha, 10)
  }

  next()
})

// Método para comparar senha
clienteSchema.methods.compararSenha = async function (senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha)
}

module.exports = mongoose.model('Cliente', clienteSchema)
