// 📂 src/stores/pedidos.js
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
    // 🔧 Utilitário de erro
    // ============================
    setErro(err) {
      console.error('[pedidos.store] erro:', err)
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
        this.pedidos = Array.isArray(data.pedidos) ? data.pedidos : []
        return this.pedidos
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
        if (data?.pedido) {
          this.pedidos = [...this.pedidos, data.pedido]
          return data.pedido
        }
        return null
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async finalizarCompra(itens) {
      this.error = null
      try {
        const { data } = await pedidoService.cadastrarPedido(itens)
        if (data?.pedido) {
          this.pedidos = [...this.pedidos, data.pedido]
        }
        return {
          mensagem: data?.mensagem || 'Compra finalizada com sucesso',
          pedido: data?.pedido || null
        }
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async atualizarStatus(id, novoStatus) {
      this.error = null
      try {
        const { data } = await pedidoService.atualizarPedido(id, { status: novoStatus })
        const idx = this.pedidos.findIndex(p => p._id === id)
        if (idx !== -1 && data?.pedido) {
          this.pedidos[idx] = data.pedido
          this.pedidos = [...this.pedidos]
        }
        return data?.pedido ?? null
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async carregarHistorico() {
      this.error = null
      try {
        const { data } = await pedidoService.historicoPedidos()
        this.historico = Array.isArray(data.pedidos) ? data.pedidos : []
        return this.historico
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async limparPedidosCliente() {
      this.error = null
      try {
        await pedidoService.limparPedidosCliente()
        this.pedidos = []
        this.historico = []
        return {}
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    // ============================
    // 👤 Funcionalidades do Admin
    // ============================
    async listarTodosPedidosAdmin() {
      this.error = null
      try {
        const { data } = await pedidoService.listarTodosPedidosAdmin()
        this.pedidos = Array.isArray(data.pedidos) ? data.pedidos : []
        return this.pedidos
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async liberarPedido(id) {
      this.error = null
      try {
        const { data } = await pedidoService.liberarPedido(id)
        const idx = this.pedidos.findIndex(p => p._id === id)
        if (idx !== -1 && data?.pedido) {
          this.pedidos[idx] = data.pedido
          this.pedidos = [...this.pedidos]
        }
        return data?.pedido ?? null
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async excluirPedidosClienteAdmin(codigoCliente) {
      this.error = null
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
      this.error = null
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
    // Funcionalidades do Superadmin
    // ============================
    async listarTodosPedidosSuperadmin() {
      this.error = null
      try {
        const { data } = await pedidoService.listarTodosPedidosSuperadmin()
        this.pedidos = Array.isArray(data.pedidos) ? data.pedidos : []

        // 🔎 Teste: logar no console
        console.log('[STORE] pedidos carregados:', this.pedidos)

        return this.pedidos
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async liberarParaProducao(id) {
      this.error = null
      try {
        const { data } = await pedidoService.liberarParaProducao(id)
        const idx = this.pedidos.findIndex(p => p._id === id)
        if (idx !== -1 && data?.pedido) {
          this.pedidos[idx] = data.pedido
        }
        return data?.pedido ?? null
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async excluirTodosPedidosSuperadmin() {
      this.error = null
      try {
        await pedidoService.excluirTodosPedidosSuperadmin()
        this.pedidos = []
        this.historico = []
        return []
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async cancelarPedido(id) {
      this.error = null
      const idx = this.pedidos.findIndex(p => p._id === id)
      const snapshot = [...this.pedidos]

      if (idx !== -1) {
        this.pedidos[idx] = { ...this.pedidos[idx], status: 'cancelado' }
        this.pedidos = [...this.pedidos]
      }

      try {
        const { data } = await pedidoService.cancelarPedido(id)
        if (idx !== -1 && data?.pedido) {
          this.pedidos[idx] = data.pedido
          this.pedidos = [...this.pedidos]
        }
        return data?.pedido ?? null
      } catch (err) {
        this.pedidos = snapshot
        this.setErro(err)
        throw err
      }
    }
  },

  // ============================
  // Getters de formatação e cálculo
  // ============================
  getters: {
    formatarStatus: () => (status) => {
      const mapa = {
        iniciado: 'iniciado',
        em_processamento: 'em_processamento',
        pronto: 'pronto',
        cancelado: 'cancelado'
      }
      return mapa[status] || status
    },

    formatarData: () => (data) => {
      return new Date(data).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
      })
    },

    getQuantidade: () => (pedido, produtoId) => {
      const item = pedido?.itens?.find(
        i => i.produtoId === produtoId || i.produtoId?._id === produtoId
      )
      return item ? item.quantidade : 0
    }
  }
})
