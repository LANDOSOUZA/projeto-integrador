// services/opcuaService.js
const {
  OPCUAClient,
  MessageSecurityMode,
  SecurityPolicy
} = require("node-opcua");

const endpointUrl = "opc.tcp://192.168.0.1:4840"; // IP do CLP

class OpcuaService {
  constructor() {
    this.client = OPCUAClient.create({
      securityMode: MessageSecurityMode.None,
      securityPolicy: SecurityPolicy.None,
      endpointMustExist: false
    });
    this.session = null;
  }

  async connect() {
    console.log("🚀 Conectando ao CLP OPC UA...");
    await this.client.connect(endpointUrl);
    this.session = await this.client.createSession();
    console.log("✅ Sessão OPC UA criada.");
  }

  async disconnect() {
    if (this.session) {
      await this.session.close();
    }
    await this.client.disconnect();
    console.log("🔒 Sessão encerrada.");
  }

  async lerStatusGeral() {
    const nodeId = "ns=3;s=status.geral"; // exemplo do documento
    const dataValue = await this.session.readVariableValue(nodeId);
    return dataValue.value.value; // retorna o INT do status geral
  }

  async escreverPedido(pedido) {
    // pedido = { op, produto, quant }
    await this.session.write({
      nodeId: "ns=3;s=pedido.op",
      attributeId: 13,
      value: { value: { dataType: 6, value: pedido.op } } // DINT
    });

    await this.session.write({
      nodeId: "ns=3;s=pedido.produto",
      attributeId: 13,
      value: { value: { dataType: 2, value: pedido.produto } } // INT
    });

    await this.session.write({
      nodeId: "ns=3;s=pedido.quant",
      attributeId: 13,
      value: { value: { dataType: 2, value: pedido.quant } } // INT
    });

    // sinaliza novo pedido
    await this.session.write({
      nodeId: "ns=3;s=cmd.novoPed",
      attributeId: 13,
      value: { value: { dataType: 1, value: true } } // BOOL
    });

    console.log("📤 Pedido enviado ao PLC:", pedido);
  }
}

module.exports = OpcuaService;
