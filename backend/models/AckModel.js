class Ack {
  constructor({
    pedidoACK,
    aplicaACK,
    inicioACK,
    execACK,
    fimACK,
    falhaACK
  }) {
    this.pedidoACK = pedidoACK; // BOOL
    this.aplicaACK = aplicaACK; // BOOL
    this.inicioACK = inicioACK; // BOOL
    this.execACK = execACK;     // BOOL
    this.fimACK = fimACK;       // BOOL
    this.falhaACK = falhaACK;   // BOOL
  }
}

module.exports = Ack;
