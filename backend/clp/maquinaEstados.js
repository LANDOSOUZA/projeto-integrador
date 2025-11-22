// backend/clp/maquinaEstados.js
const OpcuaService = require("./services/OpcuaService")
const nodes = require("./config/opcuaNodes")

class MaquinaEstados {
  constructor() {
    this.state = 0
    this.opcua = new OpcuaService()
  }

  async start() {
    await this.opcua.connect()
    console.log("🚀 Máquina de estados iniciada")
    this.loop()
  }

  async loop() {
    switch (this.state) {
      case 0: // Disponível
        console.log("📡 Estado 0: Disponível")
        const novoPed = await this.opcua.ler(nodes.cmd.novoPed)
        if (novoPed) this.setState(1)
        break

      case 1: // Ler & aplicar pedido
        console.log("📡 Estado 1: Ler & aplicar pedido")
        const pedidoACK = await this.opcua.ler(nodes.ack.pedidoACK)
        const aplicaACK = await this.opcua.ler(nodes.ack.aplicaACK)
        if (pedidoACK && aplicaACK) this.setState(2)
        break

      case 2: // Pronto para início
        console.log("📡 Estado 2: Pronto para início")
        const inicioACK = await this.opcua.ler(nodes.ack.inicioACK)
        if (inicioACK) this.setState(10)
        break

      case 10: // Executando OP
        console.log("⚙️ Estado 10: Executando OP")
        const execACK = await this.opcua.ler(nodes.ack.execACK)
        const fimACK = await this.opcua.ler(nodes.ack.fimACK)
        const falhaACK = await this.opcua.ler(nodes.ack.falhaACK)

        if (falhaACK) {
          console.log("❌ Falha detectada")
          this.setState(30)
        } else if (fimACK) {
          this.setState(11)
        } else if (execACK) {
          console.log("📡 Execução em andamento...")
        }
        break

      case 11: // Fim da OP
        console.log("✅ Estado 11: Fim da OP")
        this.setState(12)
        break

      case 12: // Reset
        console.log("🔄 Estado 12: Reset")
        await this.opcua.pulso(nodes.cmd.reset) // envia pulso de reset
        this.setState(0)
        break

      case 20: // Reabastecimento
        console.log("📦 Estado 20: Reabastecimento")
        const estoque = await this.opcua.ler(nodes.status.estoqueProd)
        // se estoque suficiente, volta para execução
        if (estoque[this.pedidoProduto] >= this.pedidoQuant) {
          this.setState(21)
        }
        break

      case 21: // Volta para execução
        console.log("➡️ Estado 21: Volta para execução")
        this.setState(10)
        break

      case 30: // Falha
        console.log("❌ Estado 30: Falha")
        const codFalha = await this.opcua.ler(nodes.status.falhaAtivaCod)
        console.log("Código da falha:", codFalha)
        break
    }

    setTimeout(() => this.loop(), 1000)
  }

  setState(novo) {
    console.log(`➡️ Mudando para estado ${novo}`)
    this.state = novo
  }
}

const maquina = new MaquinaEstados()
maquina.start()
