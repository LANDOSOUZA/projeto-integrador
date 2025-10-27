import { defineStore } from 'pinia'

export const usePedidosStore = defineStore('pedidos', {
  state: () => ({
    pedidos: []
  }),
  actions: {
    adicionarPedido(itens) {
      const novoPedido = {
        id: this.pedidos.length + 1,
        itens,
        status: 'Iniciado'
      }
      this.pedidos.push(novoPedido)
    },
    atualizarStatus(id, novoStatus) {
      const pedido = this.pedidos.find(p => p.id === id)
      if (pedido) pedido.status = novoStatus
    },
    // 🔹 Simulação do MES/CLP
    simularMES(id) {
      const pedido = this.pedidos.find(p => p.id === id)
      if (pedido) {
        // depois de 5 segundos, muda para "Pronto"
        setTimeout(() => {
          pedido.status = 'Pronto'
        }, 5000)
      }
    }
  }
})
