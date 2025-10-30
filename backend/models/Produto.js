const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  quantidade: { type: Number, required: false },
  status: {
    type: String,
    enum: ['iniciado', 'em_processamento', 'pronto'],
    default: 'iniciado'
  }
});

module.exports = mongoose.models.Produto || mongoose.model('Produto', ProdutoSchema);
