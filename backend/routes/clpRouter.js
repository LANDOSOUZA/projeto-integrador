// 📂 src/routes/opcua.js
const express = require('express')
const router = express.Router()
const OpcuaService = require('../services/opcuaService')

const opcua = new OpcuaService()

// Função auxiliar para executar operações com conexão OPC UA
async function executarOperacao(res, operacao, mensagemSucesso) {
  try {
    await opcua.connect()
    await operacao()
    res.status(200).json({ mensagem: mensagemSucesso })
  } catch (err) {
    res.status(500).json({ erro: 'Falha na operação OPC UA', detalhes: err.message })
  } finally {
    await opcua.disconnect()
  }
}

// 🚀 Iniciar produção
router.post('/iniciar', async (req, res) => {
  await executarOperacao(res, () => opcua.iniciarProducao(), 'Produção iniciada 🚀')
})

// 🔄 Resetar PLC
router.post('/reset', async (req, res) => {
  await executarOperacao(res, () => opcua.resetPLC(), 'PLC resetado 🔄')
})

// 🛑 Abortar pedido
router.post('/abortar', async (req, res) => {
  await executarOperacao(res, () => opcua.abortarPedido(), 'Pedido abortado 🛑')
})

module.exports = router
