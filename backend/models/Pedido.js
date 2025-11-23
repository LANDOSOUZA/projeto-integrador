const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  clienteId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cliente', 
    required: true 
  },

  ordem: { 
    type: Number, 
    required: true 
  }, // posição na fila

  codigoCliente: { 
    type: Number, 
    required: true 
  }, // número sequencial do cliente

  itens: [
    {
      produtoId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Produto', 
        required: true 
      }, // referência ao produto no catálogo
      quantidade: { 
        type: Number, 
        required: true, 
        min: [1, 'Quantidade deve ser pelo menos 1'] 
      }
    }
  ],

  status: {
    type: String,
    enum: ['iniciado', 'em_processamento', 'pronto', 'cancelado', 'processando'],
    default: 'iniciado'
  },

  data: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true // cria automaticamente createdAt e updatedAt
});

// Índices úteis para performance em consultas
pedidoSchema.index({ codigoCliente: 1 });
pedidoSchema.index({ data: -1 });

// 🔄 Hook de auto-populate: garante que itens.produtoId venha sempre populado
pedidoSchema.pre(/^find/, function(next) {
  this.populate('itens.produtoId');
  next();
});

module.exports = mongoose.model('Pedido', pedidoSchema);
