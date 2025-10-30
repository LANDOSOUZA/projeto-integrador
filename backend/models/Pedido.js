const mongoose = require('mongoose'); // 👈 importa o mongoose

const pedidoSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' }, // referência ao cliente
  laranja: Number,
  uva: Number,
  abacaxi: Number,
  status: {
    type: String,
    enum: ['iniciado', 'em_processamento', 'pronto', 'cancelado'],
    default: 'iniciado'
  },
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pedido', pedidoSchema); // 👈 exporta o model
