// server.js
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// Middlewares
const autenticarToken = require('./middleware/auth')
const verificarAdmin = require('./middleware/verificarAdmin')

// Rotas
const clienteRoutes = require('./routes/cliente')
const produtoRoutes = require('./routes/produto')
const pedidoRoutes = require('./routes/pedido')

// Função para restaurar produtos base
const garantirProdutosBase = require('./utils/garantirProdutosBase')

const app = express()
const PORT = process.env.PORT || 3000
const MONGO_URL = process.env.MONGO_URL

// Middlewares globais
app.use(cors())
app.use(express.json())

// Rotas públicas
app.use('/cliente', clienteRoutes)
app.use('/produto', produtoRoutes)

// Rotas protegidas (exigem login)
app.use('/pedido', autenticarToken, pedidoRoutes)


// Exemplo de rota admin protegida
app.get('/admin/teste', autenticarToken, verificarAdmin, (req, res) => {
  res.json({ mensagem: 'Acesso permitido apenas para admin' })
})

// Conexão com MongoDB e inicialização do servidor
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('📦 Conectado ao MongoDB')
    await garantirProdutosBase() // restaura produtos fixos
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
    })
  })
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err))
