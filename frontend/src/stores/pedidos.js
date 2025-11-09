// 📂 src/stores/pedido.js
import { defineStore } from 'pinia'
import pedidoService from '../services/pedidoService'

export const usePedidosStore = defineStore('pedidos', {
  state: () => ({
    pedidos: [],
    historico: [],
    error: null,
    loading: false
  }),

  actions: {
    async carregarPedidos() {
      this.loading = true
      try {
        const { data } = await pedidoService.listarPedidos()
        this.pedidos = data.pedidos
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async adicionarPedido(itens) {
      try {
        const { data } = await pedidoService.cadastrarPedido(itens)
        this.pedidos.push(data.pedido)
        return data.pedido
      } catch (err) {
        this.error = err
        throw err
      }
    },

    async cancelarPedido(id) {
      try {
        const { data } = await pedidoService.cancelarPedido(id)
        const pedidoIndex = this.pedidos.findIndex(p => p._id === id)
        if (pedidoIndex !== -1) {
          this.pedidos[pedidoIndex] = data.pedido
        }
        return data.pedido
      } catch (err) {
        this.error = err
        throw err
      }
    },

    async finalizarPedido(id) {
      try {
        const { data } = await pedidoService.finalizarPedido(id)
        const pedidoIndex = this.pedidos.findIndex(p => p._id === id)
        if (pedidoIndex !== -1) {
          this.pedidos[pedidoIndex] = data.pedido
        }
        return data.pedido
      } catch (err) {
        this.error = err
        throw err
      }
    },

    async atualizarStatus(id, novoStatus) {
      try {
        const { data } = await pedidoService.atualizarPedido(id, { status: novoStatus })
        const pedidoIndex = this.pedidos.findIndex(p => p._id === id)
        if (pedidoIndex !== -1) {
          this.pedidos[pedidoIndex] = data.pedido
        }
      } catch (err) {
        this.error = err
      }
    },

    async carregarHistorico() {
      try {
        const { data } = await pedidoService.historicoPedidos()
        this.historico = data.pedidos
      } catch (err) {
        this.error = err
      }
    },

    async limparPedidosCliente() {
      try {
        const { data } = await pedidoService.limparPedidosCliente()
        this.pedidos = []
        this.historico = []
        return data
      } catch (err) {
        this.error = err
        throw err
      }
    }
  }
})
