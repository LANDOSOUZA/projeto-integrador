const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
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

