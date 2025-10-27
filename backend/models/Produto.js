const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  quantidade: { type: Number, required: true },
  status: {
    type: String,
    enum: ['iniciado', 'em_processamento', 'pronto'],
    default: 'iniciado'
  }
});

module.exports = mongoose.model('Produto', ProdutoSchema);
