import { defineStore } from 'pinia'

export const usePedidosStore = defineStore('pedidos', {
  state: () => ({
    pedidos: []
  }),

  actions: {
    adicionarPedido(itens) {
      const totalItens = itens.reduce((acc, item) => acc + item.quantidade, 0)

      if (totalItens < 1 || totalItens > 3) {
        throw new Error('Cada pedido deve conter entre 1 e 3 itens.')
      }

      const novoPedido = {
        id: this.pedidos.length + 1,
        itens,
        status: 'Iniciado',
        criadoEm: new Date().toISOString()
      }

      this.pedidos.push(novoPedido)
    },

    atualizarStatus(id, novoStatus) {
      const pedido = this.pedidos.find(p => p.id === id)
      if (pedido) pedido.status = novoStatus
    },

    simularMES(id) {
      const pedido = this.pedidos.find(p => p.id === id)
      if (pedido) {
        setTimeout(() => {
          pedido.status = 'Pronto'
        }, 5000)
      }
    }
  }
})
