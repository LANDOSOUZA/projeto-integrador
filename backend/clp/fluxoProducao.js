// backend/clp/fluxoProducao.js
const OpcuaService = require("./services/OpcuaService")
const nodes = require("./config/opcuaNodes")

class FluxoProducao {
  constructor() {
    this.state = 0
    this.pedido = null
    this.opcua = new OpcuaService()
  }

  async connect() { await this.opcua.connect() }
  async disconnect() { await this.opcua.disconnect() }

  async novoPedido(op, produto, quant) {
    this.pedido = { op, produto, quant }
    console.log("📝 Pedido criado:", this.pedido)
    await this.opcua.escreverPedido(this.pedido)
    this.setState(1)
  }

  async iniciar() {
    if (this.state === 2) {
      console.log("🚀 Iniciando produção...")
      await this.opcua.iniciarProducao()
      this.setState(10)
    } else {
      console.log("⚠️ Não está pronto para iniciar.")
    }
  }

  async step() {
    switch (this.state) {
      case 1:
        console.log("📥 Aplicando pedido...")
        const pedidoACK = await this.opcua.ler(nodes.ack.pedidoACK)
        const aplicaACK = await this.opcua.ler(nodes.ack.aplicaACK)
        if (pedidoACK && aplicaACK) this.setState(2)
        break

      case 2:
        console.log("✅ Pedido aplicado, pronto para iniciar")
        const inicioACK = await this.opcua.ler(nodes.ack.inicioACK)
        if (inicioACK) this.setState(10)
        break

      case 10:
        console.log("⚙️ Produzindo...")
        const execACK = await this.opcua.ler(nodes.ack.execACK)
        const fimACK = await this.opcua.ler(nodes.ack.fimACK)
        const falhaACK = await this.opcua.ler(nodes.ack.falhaACK)

        if (falhaACK) {
          console.log("❌ Falha detectada durante execução")
          this.setState(30)
        } else if (fimACK) {
          this.setState(11)
        } else if (execACK) {
          console.log("📡 Execução em andamento...")
        }
        break

      case 11:
        console.log("✅ OP finalizada com sucesso")
        await this.opcua.resetPLC()
        this.setState(0)
        break

      case 20:
        console.log("📦 Aguardando reabastecimento...")
        const estoque = await this.opcua.ler(nodes.status.estoqueProd)
        if (estoque[this.pedido.produto] >= this.pedido.quant) {
          console.log("📦 Estoque suficiente, retomando execução")
          this.setState(21)
        }
        break

      case 21:
        console.log("➡️ Retornando para execução")
        this.setState(10)
        break

      case 30:
        console.log("❌ Estado de falha — aguardando reset")
        break

      default:
        const geral = await this.opcua.ler(nodes.status.geral)
        console.log("📡 Estado atual:", this.state, " | CLP status.geral:", geral)
    }
  }

  setState(novo) {
    console.log(`➡️ Estado mudou para: ${novo}`)
    this.state = novo
  }
}

// Exemplo de uso
async function main() {
  const fluxo = new FluxoProducao()
  await fluxo.connect()

  await fluxo.novoPedido(1001, 1, 3) // OP 1001, produto=morango, quant=3
  await fluxo.step()
  await fluxo.iniciar()
  await fluxo.step()
  await fluxo.step()

  await fluxo.disconnect()
}

main()
