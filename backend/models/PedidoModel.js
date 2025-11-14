class Pedido {
  constructor({ op, produto, quant }) {
    this.op = op;         // DINT
    this.produto = produto; // INT (0=Limão, 1=Morango, 2=Laranja)
    this.quant = quant;   // INT
  }
}

module.exports = Pedido;
