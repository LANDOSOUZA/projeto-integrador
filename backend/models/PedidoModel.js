// backend/models/PedidoModel.js
class Pedido {
  constructor({ op, produto, quant }) {
    if (![0, 1, 2].includes(produto)) {
      throw new Error("Produto inválido: use 0=Limão, 1=Morango, 2=Laranja")
    }
    if (quant < 1 || quant > 3) {
      throw new Error("Quantidade inválida: deve ser entre 1 e 3")
    }

    this.op = op        // DINT
    this.produto = produto // INT (0=Limão, 1=Morango, 2=Laranja)
    this.quant = quant  // INT
  }
}

module.exports = Pedido
