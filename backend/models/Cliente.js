const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  codigo: { type: Number, unique: true }, // 👈 ID sequencial amigável
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  status: {
    type: String,
    enum: ['admin', 'usuario'],
    default: 'usuario'
  },
  dataCadastro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cliente', ClienteSchema);
