require('./database/mongoConexao');
const express = require('express');
const app = express();
require('./database/conexao'); // Garante que o banco e a tabela sejam criados

app.use(express.json()); // ← mover para cima

const clienteRoutes = require('./routes/cliente');
const pedidoRoutes = require('./routes/pedido');
const produtoRoutes = require('./routes/produto'); // ✅ nova linha

app.use('/cliente', clienteRoutes);
app.use('/pedido', pedidoRoutes);
app.use('/produto', produtoRoutes); // ✅ nova linha

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
