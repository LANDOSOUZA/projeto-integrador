// server.js
import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import createClpRouter from './routes/clpRouter.js'

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
import clpRoutes from './routes/clpRouter.js'
import estoqueRoutes from './routes/estoque.js'

// Seeds
import garantirProdutosBase from './utils/garantirProdutosBase.js'
import criarAdminBase from './utils/criarAdminBase.js'
import criarCountersBase from './utils/criarCountersBase.js'
// Instancia o serviço (mock ou real)
const OpcuaService = process.env.USE_MOCK === 'true'
  ? (await import('./services/opcuaServiceMock.js')).default
  : (await import('./services/opcuaService.js')).default

const opcua = new OpcuaService()


const app = express()
const PORT = process.env.PORT || 3000
const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_URI

// Middlewares globais
app.use(cors())
app.use(express.json())
app.use('/clp', autenticarToken, createClpRouter(opcua))

// ============================
// Rotas públicas
// ============================
app.use('/cliente', clienteRoutes)
app.use('/produto', produtoRoutes)

// ============================
// Rotas protegidas (usuário autenticado)
// ============================
app.use('/pedido', autenticarToken, pedidoRoutes)
app.use('/status', autenticarToken, statusRoutes)
app.use('/relatorios', autenticarToken, relatorioRoutes)

// ============================
// Rotas de admin
// ============================
app.use('/admin', autenticarToken, verificarAdmin, adminRoutes)

// ============================
// Rotas de estoque
// ============================
app.use('/admin', autenticarToken, estoqueRoutes)

// ============================
// Rotas de controle CLP (SuperAdmin)
// ============================
app.use('/clp', autenticarToken, clpRoutes)

// ============================
// Conexão com MongoDB
// ============================
mongoose.connect(MONGO_URL)
  .then(async () => {
    console.log('📦 Conectado ao MongoDB')

    await criarCountersBase()
    console.log('⚙️ Counters base garantidos')

    await garantirProdutosBase()
    console.log('🍹 Produtos base garantidos')

    await criarAdminBase()
    console.log('👑 SuperAdmin root garantido')

    // Conectar ao CLP (mock ou real)
    try {
      await opcua.connect()
    } catch (err) {
      console.error('⚠️ Não foi possível conectar ao CLP:', err.message)
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
    })
  })
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err))
