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
    setErro(err) {
      console.error(err)
      this.error = err
    },

    // ============================
    // 📌 Funcionalidades do Cliente
    // ============================

    async carregarPedidos() {
      this.loading = true
      this.error = null
      try {
        const { data } = await pedidoService.listarPedidos()
        this.pedidos = data.pedidos
        return data.pedidos
      } catch (err) {
        this.setErro(err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async adicionarPedido(itens) {
      this.error = null
      try {
        const { data } = await pedidoService.cadastrarPedido(itens)
        this.pedidos.push(data.pedido)
        return data.pedido
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async cancelarPedido(id) {
      const index = this.pedidos.findIndex(p => p._id === id)
      const anterior = [...this.pedidos]
      if (index !== -1) this.pedidos[index].status = 'cancelado'
      try {
        const { data } = await pedidoService.cancelarPedido(id)
        this.pedidos[index] = data.pedido
        return data.pedido
      } catch (err) {
        this.setErro(err)
        this.pedidos = anterior
        throw err
      }
    },

    async finalizarPedido(id) {
      try {
        const { data } = await pedidoService.finalizarPedido(id)
        const index = this.pedidos.findIndex(p => p._id === id)
        if (index !== -1) this.pedidos[index] = data.pedido
        if (data.pedido.status === 'finalizado') {
          this.historico.push(data.pedido)
        }
        return data.pedido
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async atualizarStatus(id, novoStatus) {
      try {
        const { data } = await pedidoService.atualizarPedido(id, { status: novoStatus })
        const index = this.pedidos.findIndex(p => p._id === id)
        if (index !== -1) this.pedidos[index] = data.pedido
        return data.pedido
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async carregarHistorico() {
      try {
        const { data } = await pedidoService.historicoPedidos()
        this.historico = data.pedidos
        return data.pedidos
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async limparPedidosCliente() {
      try {
        const { data } = await pedidoService.limparPedidosCliente()
        this.pedidos = []
        this.historico = []
        return data
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    // ============================
    // 📌 Funcionalidades do Admin
    // ============================

    async listarTodosPedidosAdmin() {
      this.error = null
      try {
        const { data } = await pedidoService.listarTodosPedidosAdmin()
        this.pedidos = data.pedidos
        return data.pedidos
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async liberarPedido(id) {
      try {
        const { data } = await pedidoService.liberarPedido(id)
        const index = this.pedidos.findIndex(p => p._id === id)
        if (index !== -1) this.pedidos[index] = data.pedido
        return data.pedido
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async excluirPedidosClienteAdmin(codigoCliente) {
      try {
        await pedidoService.excluirPedidosClienteAdmin(codigoCliente)
        this.pedidos = this.pedidos.filter(p => p.codigoCliente !== codigoCliente)
        return this.pedidos
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async limparPedidos() {
      try {
        await pedidoService.limparPedidos()
        this.pedidos = []
        return []
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    // ============================
    // 📌 Funcionalidades do Superadmin
    // ============================

    async listarTodosPedidosSuperadmin() {
      try {
        const { data } = await pedidoService.listarTodosPedidosSuperadmin()
        this.pedidos = data.pedidos
        return data.pedidos
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async excluirTodosPedidosSuperadmin() {
      try {
        await pedidoService.excluirTodosPedidosSuperadmin()
        this.pedidos = []
        this.historico = []
        return []
      } catch (err) {
        this.setErro(err)
        throw err
      }
    }
  }
})
