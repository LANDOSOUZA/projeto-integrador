import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

// Middlewares
import autenticarToken from './middleware/auth.js'
import verificarAdmin from './middleware/verificarAdmin.js'

// Rotas
import clienteRoutes from './routes/cliente.js'
import produtoRoutes from './routes/produto.js'
import pedidoRoutes from './routes/pedido.js'
import adminRoutes from './routes/admin.js'
import statusRoutes from './routes/statusRouter.js'
import relatorioRoutes from './routes/relatorioRouter.js'
import clpRoutes from './routes/clpRouter.js' // ✅ nova rota CLP

// Seeds
import garantirProdutosBase from './utils/garantirProdutosBase.js'
import criarAdminBase from './utils/criarAdminBase.js'
import criarCountersBase from './utils/criarCountersBase.js'

const app = express()
const PORT = process.env.PORT || 3000
const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_URI

// Middlewares globais
app.use(cors())
app.use(express.json())

// Rotas públicas
app.use('/cliente', clienteRoutes)
app.use('/produto', produtoRoutes)

// Rotas protegidas
app.use('/pedido', autenticarToken, pedidoRoutes)
app.use('/status', autenticarToken, statusRoutes)
app.use('/relatorios', autenticarToken, relatorioRoutes)

// Rotas de admin
app.use('/admin', autenticarToken, verificarAdmin, adminRoutes)

// Rotas de controle CLP (SuperAdmin)
app.use('/clp', autenticarToken, clpRoutes)

// Conexão com MongoDB
mongoose.connect(MONGO_URL)
  .then(async () => {
    console.log('📦 Conectado ao MongoDB')

    await criarCountersBase()
    console.log('⚙️ Counters base garantidos')

    await garantirProdutosBase()
    console.log('🍹 Produtos base garantidos')

    await criarAdminBase()
    console.log('👑 SuperAdmin root garantido')

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
    })
  })
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err))
