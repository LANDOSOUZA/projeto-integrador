const express = require('express')
const router = express.Router()
const OpcuaService = require('../services/opcuaService')

const opcua = new OpcuaService()

router.post('/iniciar', async (req, res) => {
  try {
    await opcua.connect()
    await opcua.iniciarProducao()
    await opcua.disconnect()
    res.json({ message: 'Produção iniciada 🚀' })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao iniciar produção', details: err.message })
  }
})

router.post('/reset', async (req, res) => {
  try {
    await opcua.connect()
    await opcua.resetPLC()
    await opcua.disconnect()
    res.json({ message: 'PLC resetado 🔄' })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao resetar PLC', details: err.message })
  }
})

router.post('/abortar', async (req, res) => {
  try {
    await opcua.connect()
    await opcua.abortarPedido()
    await opcua.disconnect()
    res.json({ message: 'Pedido abortado 🛑' })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao abortar pedido', details: err.message })
  }
})

module.exports = router
