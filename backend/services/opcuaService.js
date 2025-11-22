const { OPCUAClient, MessageSecurityMode, SecurityPolicy } = require("node-opcua")
const nodes = require("../config/opcuaNodes")

const endpointUrl = process.env.OPCUA_ENDPOINT || "opc.tcp://192.168.0.1:4840"

class OpcuaService {
  constructor() {
    this.client = OPCUAClient.create({
      securityMode: MessageSecurityMode.None,
      securityPolicy: SecurityPolicy.None,
      endpointMustExist: false
    })
    this.session = null
  }

  async connect() {
    console.log("🚀 Conectando ao CLP OPC UA...")
    await this.client.connect(endpointUrl)
    this.session = await this.client.createSession()
    console.log("✅ Sessão OPC UA criada.")
  }

  async disconnect() {
    if (this.session) {
      await this.session.close()
    }
    await this.client.disconnect()
    console.log("🔒 Sessão encerrada.")
  }

  // Função genérica de leitura
  async ler(nodeId) {
    const dataValue = await this.session.readVariableValue(nodeId)
    return dataValue.value.value
  }

  // Função genérica de escrita
  async escrever(nodeId, dataType, value) {
    await this.session.write({
      nodeId,
      attributeId: 13,
      value: { value: { dataType, value } }
    })
  }

  // Métodos de leitura (usando nodes centralizados)
  async lerStatusGeral() { return this.ler(nodes.status.geral) }
  async lerAccSinc() { return this.ler(nodes.status.accSinc) }
  async lerOpAtual() { return this.ler(nodes.status.opAtual) }
  async lerFalhaAtiva() { return this.ler(nodes.status.falhaAtiva) }
  async lerFalhaAtivaCod() { return this.ler(nodes.status.falhaAtivaCod) }
  async lerMesProd() { return this.ler(nodes.status.mesProd) }
  async lerMesFalt() { return this.ler(nodes.status.mesFalt) }
  async lerMesUltimoCiclo() { return this.ler(nodes.status.mesUltimoCiclo) }
  async lerMesTempInicio() { return this.ler(nodes.status.mesTempInicio) }
  async lerMesTempFim() { return this.ler(nodes.status.mesTempFim) }
  async lerMesPcsBoas() { return this.ler(nodes.status.mesPcsBoas) }
  async lerMesPcsRuins() { return this.ler(nodes.status.mesPcsRuins) }

  // Escrita de pedido
  async escreverPedido({ op, produto, quant }) {
    await this.escrever(nodes.pedido.op, 6, op)       // DINT
    await this.escrever(nodes.pedido.produto, 2, produto) // INT
    await this.escrever(nodes.pedido.quant, 2, quant)     // INT
    await this.escrever(nodes.cmd.novoPed, 1, true)       // BOOL
    console.log("📤 Pedido enviado ao PLC:", { op, produto, quant })
  }

  // Comandos
  async iniciarProducao() { await this.escrever(nodes.cmd.inicio, 1, true) }
  async resetPLC() { await this.escrever(nodes.cmd.reset, 1, true) }
  async abortarPedido() { await this.escrever(nodes.cmd.abortar, 1, true) }
}

module.exports = OpcuaService
