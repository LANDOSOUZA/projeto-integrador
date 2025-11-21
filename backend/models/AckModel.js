// backend/services/ackService.js
const Ack = require('../models/AckModel')
const OpcuaService = require('../services/opcuaService')

const opcua = new OpcuaService()

async function lerAck() {
  await opcua.connect()
  const ack = new Ack({
    pedidoACK: await opcua.lerPedidoACK(),
    aplicaACK: await opcua.lerAplicaACK(),
    inicioACK: await opcua.lerInicioACK(),
    execACK: await opcua.lerExecACK(),
    fimACK: await opcua.lerFimACK(),
    falhaACK: await opcua.lerFalhaACK()
  })
  await opcua.disconnect()
  return ack
}

module.exports = { lerAck }
