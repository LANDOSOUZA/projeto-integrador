import express from 'express'
import clpController from '../controllers/clpController.js'

// Recebe o serviço já instanciado no server.js
export default function createClpRouter(opcua) {
  const router = express.Router()

  // Iniciar produção
  router.post('/iniciar', async (req, res) => {
    try {
      await opcua.iniciarProducao()
      res.json({ message: 'Produção iniciada 🚀' })
    } catch (err) {
      res.status(500).json({ error: 'Erro ao iniciar produção', details: err.message })
    }
  })

  // Resetar PLC
  router.post('/reset', async (req, res) => {
    try {
      await opcua.resetPLC()
      res.json({ message: 'PLC resetado 🔄' })
    } catch (err) {
      res.status(500).json({ error: 'Erro ao resetar PLC', details: err.message })
    }
  })

  // Abortar pedido
  router.post('/abortar', async (req, res) => {
    try {
      await opcua.abortarPedido()
      res.json({ message: 'Pedido abortado 🛑' })
    } catch (err) {
      res.status(500).json({ error: 'Erro ao abortar pedido', details: err.message })
    }
  })

  // Enviar pedido ao CLP
  router.post('/pedido', async (req, res) => {
    try {
      const { op, produto, quant } = req.body
      await opcua.escreverPedido({ op, produto, quant })
      res.json({ message: '📤 Pedido enviado ao CLP', pedido: { op, produto, quant } })
    } catch (err) {
      res.status(500).json({ error: 'Erro ao enviar pedido', details: err.message })
    }
  })

  // Atualizar status vindo do CLP
  router.post('/status', clpController.atualizarStatusCLP)

  return router
}
