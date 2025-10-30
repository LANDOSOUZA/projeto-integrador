const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const Produto = require('./models/produto'); // 👈 Importa o modelo

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
require('dotenv').config(); // caso use .env
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/projeto_integrador';

// 🔁 Função para garantir os produtos base
async function garantirProdutosBase() {
  const nomesBase = ['Suco de Laranja', 'Suco de Uva', 'Suco de Abacaxi'];
  const existentes = await Produto.find({ nome: { $in: nomesBase } });

  if (existentes.length < nomesBase.length) {
    const faltantes = nomesBase.filter(nome => !existentes.some(p => p.nome === nome));
    const novos = faltantes.map((nome, index) => ({
      idProduto: index + 1,
      nome,
      preco: 12.00,
      embalagem: '500 ml',
      status: 'iniciado'
    }));

    await Produto.insertMany(novos);
    console.log('✅ Produtos base restaurados:', faltantes);
  }
}

// Rotas
const produtoRoutes = require('./routes/produto');
app.use('/produto', produtoRoutes);

const clienteRoutes = require('./routes/cliente');
app.use('/cliente', clienteRoutes);

const pedidoRoutes = require('./routes/pedido');
app.use('/pedido', pedidoRoutes);

// Porta
const PORT = 3000;

// 🔌 Conecta ao MongoDB e inicia servidor
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('📦 Conectado ao MongoDB');
    await garantirProdutosBase(); // 👈 Restaura os produtos fixos
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

