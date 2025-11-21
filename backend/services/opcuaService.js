// backend/services/opcuaService.js
const {
  OPCUAClient,
  MessageSecurityMode,
  SecurityPolicy,
  AttributeIds,
  ClientSubscription,
  TimestampsToReturn,
  DataType
} = require("node-opcua")

const nodes = require("../clp/config/opcuaNodes")
const endpointUrl = process.env.OPCUA_ENDPOINT || "opc.tcp://192.168.0.1:4840"

class OpcuaService {
  constructor() {
    this.client = OPCUAClient.create({
      securityMode: MessageSecurityMode.None,
      securityPolicy: SecurityPolicy.None,
      endpointMustExist: false,
      connectionStrategy: { initialDelay: 1000, maxRetry: 10 },
      requestedSessionTimeout: 30 * 60 * 1000
    })
    this.session = null
    this.subscription = null
  }

  async connect() {
    if (this.session) {
      console.log("⚡ Já conectado ao CLP OPC UA.")
      return
    }
    console.log("🚀 Conectando ao CLP OPC UA...")
    await this.client.connect(endpointUrl)
    this.session = await this.client.createSession()
    console.log("✅ Sessão OPC UA criada.")

    this.subscription = ClientSubscription.create(this.session, {
      requestedPublishingInterval: 1000,
      requestedLifetimeCount: 600,
      requestedMaxKeepAliveCount: 20,
      maxNotificationsPerPublish: 100,
      publishingEnabled: true,
      priority: 10
    })

    this.subscription.on("started", () => console.log("📡 Subscription iniciada"))
    this.subscription.on("keepalive", () => console.log("💓 KeepAlive recebido"))
    this.subscription.on("terminated", () => console.log("❌ Subscription encerrada"))

    await this.monitorarNode(nodes.status.geral, "Status Geral")
  }

  async disconnect() {
    if (this.subscription) await this.subscription.terminate()
    if (this.session) {
      await this.session.close()
      this.session = null
    }
    await this.client.disconnect()
    console.log("🔒 Sessão encerrada.")
  }

  async ler(nodeId) {
    const dataValue = await this.session.readVariableValue(nodeId)
    return dataValue.value.value
  }

  async escrever(nodeId, dataType, value) {
    await this.session.write({
      nodeId,
      attributeId: AttributeIds.Value,
      value: { value: { dataType, value } }
    })
  }

  async escreverPulso(nodeId) {
    await this.escrever(nodeId, DataType.Boolean, true)
    await new Promise(r => setTimeout(r, 500))
    await this.escrever(nodeId, DataType.Boolean, false)
  }

  async pulso(nodeId) { return this.escreverPulso(nodeId) }

  async monitorarNode(nodeId, nome) {
    const itemToMonitor = { nodeId, attributeId: AttributeIds.Value }
    const parameters = { samplingInterval: 1000, discardOldest: true, queueSize: 10 }
    const monitoredItem = await this.subscription.monitor(itemToMonitor, parameters, TimestampsToReturn.Both)
    monitoredItem.on("changed", (dataValue) => {
      console.log(`🔎 ${nome}:`, dataValue.value.value)
    })
  }

  // Leitura de status
  async lerStatusGeral() { return this.ler(nodes.status.geral) }
  async lerOpAtual() { return this.ler(nodes.status.opAtual) }
  async lerFalhaAtiva() { return this.ler(nodes.status.falhaAtiva) }
  async lerFalhaCod() { return this.ler(nodes.status.falhaAtivaCod) }
  async lerEstoqueProd() { return this.ler(nodes.status.estoqueProd) }

  // Leitura de ACKs
  async lerPedidoACK() { return this.ler(nodes.ack.pedidoACK) }
  async lerAplicaACK() { return this.ler(nodes.ack.aplicaACK) }
  async lerInicioACK() { return this.ler(nodes.ack.inicioACK) }
  async lerExecACK() { return this.ler(nodes.ack.execACK) }
  async lerFimACK() { return this.ler(nodes.ack.fimACK) }
  async lerFalhaACK() { return this.ler(nodes.ack.falhaACK) }

  // Escrita de pedido
  async escreverPedido({ op, produto, quant }) {
    await this.escrever(nodes.pedido.op, DataType.Int32, op)
    await this.escrever(nodes.pedido.produto, DataType.Int16, produto)
    await this.escrever(nodes.pedido.quant, DataType.Int16, quant)
    await this.escreverPulso(nodes.cmd.novoPed)
    console.log("📤 Pedido enviado ao PLC:", { op, produto, quant })
  }

  // Comandos
  async iniciarProducao() { await this.escreverPulso(nodes.cmd.inicio) }
  async resetPLC() { await this.escreverPulso(nodes.cmd.reset) }
  async abortarPedido() { await this.escreverPulso(nodes.cmd.abortar) }
}

module.exports = OpcuaService
