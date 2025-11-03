// backend/models/Produto.js
const mongoose = require('mongoose')

const produtoSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // 👈 identificador sequencial de negócio
  nome: { type: String, required: true, trim: true },
  peso: { type: String },
  descricao: { type: String },
  preco: { type: Number, required: true, min: [0, 'O preço não pode ser negativo'] },
  quantidade: { type: Number, default: 0, min: [0, 'A quantidade não pode ser negativa'] },
  status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
  criadoEm: { type: Date, default: Date.now }
}, { timestamps: true })

// 🔢 Antes de salvar, gera id sequencial automaticamente se não for definido
produtoSchema.pre('save', async function (next) {
  if (this.isNew && !this.id) {
    const ultimo = await this.constructor.findOne().sort('-id')
    this.id = ultimo ? ultimo.id + 1 : 1
  }
  next()
})

module.exports = mongoose.models.Produto || mongoose.model('Produto', produtoSchema)
