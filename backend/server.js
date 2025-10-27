const express = require('express');
const app = express();
const cors = require('cors');

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
require('./database/mongoConexao');

// Rotas
const produtoRoutes = require('./routes/produto');
app.use('/produto', produtoRoutes);

const clienteRoutes = require('./routes/cliente');
app.use('/cliente', clienteRoutes);

// 👇 Adicione estas duas linhas
const pedidoRoutes = require('./routes/pedido');
app.use('/pedido', pedidoRoutes);
               // 👈 registra no Express

// Porta
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
