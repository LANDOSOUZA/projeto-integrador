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
    // ============================
    // 📌 Funcionalidades do Cliente
    // ============================

    // Carregar pedidos do cliente logado
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

    // Adicionar novo pedido
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

    // Cancelar pedido (cliente ou admin)
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

    // Finalizar pedido (CLP)
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

    // Atualizar status genérico
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

    // Carregar histórico do cliente
    async carregarHistorico() {
      try {
        const { data } = await pedidoService.historicoPedidos()
        this.historico = data.pedidos
      } catch (err) {
        this.error = err
      }
    },

    // Limpar pedidos do cliente logado
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
    },

    // ============================
    // 📌 Funcionalidades do Admin
    // ============================

    // Listar todos os pedidos (Admin)
    async listarTodosPedidosAdmin() {
      try {
        const { data } = await pedidoService.listarTodosPedidosAdmin()
        this.pedidos = data.pedidos
      } catch (err) {
        this.error = err
        throw err
      }
    },

    // Liberar pedido para CLP (Admin)
    async liberarPedido(id) {
      try {
        const { data } = await pedidoService.liberarPedido(id)
        const pedidoIndex = this.pedidos.findIndex(p => p._id === id)
        if (pedidoIndex !== -1) {
          this.pedidos[pedidoIndex] = data.pedido
        }
        return data.pedido.status
      } catch (err) {
        this.error = err
        throw err
      }
    },

    // Excluir todos os pedidos de um cliente (Admin)
    async excluirPedidosClienteAdmin(codigoCliente) {
      try {
        await pedidoService.excluirPedidosClienteAdmin(codigoCliente)
        this.pedidos = this.pedidos.filter(p => p.codigoCliente !== codigoCliente)
      } catch (err) {
        this.error = err
        throw err
      }
    },

    // Limpar todos os pedidos do sistema (Admin)
    async limparPedidos() {
      try {
        await pedidoService.limparPedidos()
        this.pedidos = []
      } catch (err) {
        this.error = err
        throw err
      }
    }
  }
})
