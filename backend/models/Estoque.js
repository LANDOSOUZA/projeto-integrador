const mongoose = require('mongoose')

const EstoqueSchema = new mongoose.Schema({
  produtoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true }, // vínculo com Produto
  quantidade: { type: Number, required: true, default: 0 } // quantidade disponível
}, { timestamps: true })

module.exports = mongoose.model('Estoque', EstoqueSchema)
