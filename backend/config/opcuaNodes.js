// config/opcuaNodes.js
// Centraliza todos os NodeIds OPC UA usados pelo backend.
// Se o CLP mudar namespace ou nomes, basta alterar aqui.

const NS = process.env.OPCUA_NAMESPACE_INDEX || 3 // namespace index padrão

function node(tag) {
  return `ns=${NS};s=${tag}`
}

module.exports = {
  status: {
    geral: node("status.geral"),
    falhaAtiva: node("status.falhaAtiva"),
    falhaAtivaCod: node("status.falhaAtivaCod"),
    accSinc: node("status.accSinc"),
    opAtual: node("status.opAtual"),
    estoqueProd: node("status.estoqueProd"),
    mesProd: node("status.mesProd"),
    mesFalt: node("status.mesFalt"),
    mesUltimoCiclo: node("status.mesUltimoCiclo"),
    mesTempInicio: node("status.mesTempInicio"),
    mesTempFim: node("status.mesTempFim"),
    mesPcsBoas: node("status.mesPcsBoas"),
    mesPcsRuins: node("status.mesPcsRuins")
  },
  pedido: {
    op: node("pedido.op"),
    produto: node("pedido.produto"),
    quant: node("pedido.quant")
  },
  cmd: {
    novoPed: node("cmd.novoPed"),
    inicio: node("cmd.inicio"),
    abortar: node("cmd.abortar"),
    reset: node("cmd.reset")
  },
  ack: {
    pedidoACK: node("ack.pedidoACK"),
    aplicaACK: node("ack.aplicaACK"),
    inicioACK: node("ack.inicioACK"),
    execACK: node("ack.execACK"),
    fimACK: node("ack.fimACK"),
    falhaACK: node("ack.falhaACK")
  }
}
