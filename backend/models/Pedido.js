const mongoose = require('mongoose'); // 👈 importa o mongoose

const pedidoSchema = new mongoose.Schema({
  clienteId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cliente', 
    required: true 
  }, // referência ao cliente

  codigoCliente: { 
    type: Number, 
    required: true 
  }, // número sequencial para facilitar CRUD do admin

  laranja: { 
    type: Number, 
    default: 0 
  },
  uva: { 
    type: Number, 
    default: 0 
  },
  abacaxi: { 
    type: Number, 
    default: 0 
  },

  status: {
    type: String,
    enum: ['iniciado', 'em_processamento', 'pronto', 'cancelado'],
    default: 'iniciado'
  },

  data: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Pedido', pedidoSchema); // 👈 exporta o model
