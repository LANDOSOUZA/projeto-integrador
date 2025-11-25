import { defineStore } from 'pinia'
import pedidoService from '../services/pedidoService'
import clpService from '../services/clpService'

export const usePedidosStore = defineStore('pedidos', {
  state: () => ({
    pedidos: [],
    historico: [],
    error: null,
    loading: false
  }),

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

    // produtoId sempre como string (_id do Mongo)
    getQuantidade: () => (pedido, produtoId) => {
      const item = pedido?.itens?.find(i => i.produtoId === produtoId)
      return item ? item.quantidade : 0
    }
  },

  actions: {
    setErro(err) {
      console.error('[pedidos.store] erro:', err)
      this.error = err
    },

    async carregarPedidos() {
      this.loading = true
      this.error = null
      try {
        const { data } = await pedidoService.listarPedidos()
        const lista = Array.isArray(data?.pedidos) ? data.pedidos : []
        // normaliza itens para garantir produtoId como string
        this.pedidos = lista.map(p => ({
          ...p,
          itens: Array.isArray(p.itens)
            ? p.itens.map(i => ({
                ...i,
                produtoId: typeof i.produtoId === 'object' && i.produtoId?._id
                  ? i.produtoId._id
                  : i.produtoId
              }))
            : []
        }))
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
        // itens: [{ produtoId: '<_id>', quantidade: N }]
        const { data } = await pedidoService.cadastrarPedido(itens)
        const pedido = data?.pedido
        if (pedido) {
          const normalizado = {
            ...pedido,
            itens: Array.isArray(pedido.itens)
              ? pedido.itens.map(i => ({
                  ...i,
                  produtoId: typeof i.produtoId === 'object' && i.produtoId?._id
                    ? i.produtoId._id
                    : i.produtoId
                }))
              : []
          }
          const idx = this.pedidos.findIndex(p => p._id === normalizado._id)
          if (idx !== -1) {
            this.pedidos[idx] = normalizado
          } else {
            this.pedidos.push(normalizado)
          }
          return normalizado
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
        // itens: [{ produtoId: '<_id>', quantidade: N }]
        const { data } = await pedidoService.cadastrarPedido(itens)
        const pedido = data?.pedido
        if (pedido) {
          const normalizado = {
            ...pedido,
            itens: Array.isArray(pedido.itens)
              ? pedido.itens.map(i => ({
                  ...i,
                  produtoId: typeof i.produtoId === 'object' && i.produtoId?._id
                    ? i.produtoId._id
                    : i.produtoId
                }))
              : []
          }
          const idx = this.pedidos.findIndex(p => p._id === normalizado._id)
          if (idx !== -1) {
            this.pedidos[idx] = normalizado
          } else {
            this.pedidos.push(normalizado)
          }
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
        const pedido = data?.pedido
        if (pedido) {
          const normalizado = {
            ...pedido,
            itens: Array.isArray(pedido.itens)
              ? pedido.itens.map(i => ({
                  ...i,
                  produtoId: typeof i.produtoId === 'object' && i.produtoId?._id
                    ? i.produtoId._id
                    : i.produtoId
                }))
              : []
          }
          const idx = this.pedidos.findIndex(p => p._id === id)
          if (idx !== -1) {
            this.pedidos[idx] = normalizado
            this.pedidos = [...this.pedidos]
          }
          return normalizado
        }
        return null
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async carregarHistorico() {
      this.error = null
      try {
        const { data } = await pedidoService.historicoPedidos()
        const lista = Array.isArray(data?.pedidos) ? data.pedidos : []
        this.historico = lista.map(p => ({
          ...p,
          itens: Array.isArray(p.itens)
            ? p.itens.map(i => ({
                ...i,
                produtoId: typeof i.produtoId === 'object' && i.produtoId?._id
                  ? i.produtoId._id
                  : i.produtoId
              }))
            : []
        }))
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

    async listarTodosPedidosAdmin() {
      this.error = null
      try {
        const { data } = await pedidoService.listarTodosPedidosAdmin()
        const lista = Array.isArray(data?.pedidos) ? data.pedidos : []

        this.pedidos = lista.map(p => {
          // calcula o total do pedido
          const total = Array.isArray(p.itens)
            ? p.itens.reduce((acc, i) => {
                const produto = produtoStore.produtos.find(prod => prod._id === i.produtoId)
                return produto ? acc + produto.preco * i.quantidade : acc
              }, 0)
            : 0

          return {
            ...p,
            total,
            itens: Array.isArray(p.itens)
              ? p.itens.map(i => ({
                  ...i,
                  produtoId: typeof i.produtoId === 'object' && i.produtoId?._id
                    ? i.produtoId._id
                    : i.produtoId
                }))
              : []
          }
        })

        console.log('[STORE] pedidos carregados (admin):', this.pedidos)
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
        const pedido = data?.pedido
        if (pedido) {
          const normalizado = {
            ...pedido,
            itens: Array.isArray(pedido.itens)
              ? pedido.itens.map(i => ({
                  ...i,
                  produtoId: typeof i.produtoId === 'object' && i.produtoId?._id
                    ? i.produtoId._id
                    : i.produtoId
                }))
              : []
          }
          const idx = this.pedidos.findIndex(p => p._id === id)
          if (idx !== -1) {
            this.pedidos[idx] = normalizado
            this.pedidos = [...this.pedidos]
          }
          return normalizado
        }
        return null
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

    async reporEstoqueEPedido(pedidoId, itemId) {
      try {
        const response = await clpService.atualizarStatusCLP(
          pedidoId,
          'em_processamento',
          itemId // sempre o _id do produto (string)
        )
        return response.data
      } catch (err) {
        console.error('Erro ao repor estoque:', err)
        throw err
      }
    },

    async listarTodosPedidosSuperadmin() {
      this.error = null
      try {
        const { data } = await pedidoService.listarTodosPedidosSuperadmin()
        const lista = Array.isArray(data?.pedidos) ? data.pedidos : []

        this.pedidos = lista.map(p => ({
          ...p,
          itens: Array.isArray(p.itens)
            ? p.itens.map(i => ({
                ...i,
                produtoId: typeof i.produtoId === 'object' && i.produtoId?._id
                  ? i.produtoId._id
                  : i.produtoId
              }))
            : []
        }))

        console.log('[STORE] pedidos carregados (superadmin):', this.pedidos)
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
        const pedido = data?.pedido
        if (pedido) {
          const normalizado = {
            ...pedido,
            itens: Array.isArray(pedido.itens)
              ? pedido.itens.map(i => ({
                  ...i,
                  produtoId: typeof i.produtoId === 'object' && i.produtoId?._id
                    ? i.produtoId._id
                    : i.produtoId
                }))
              : []
          }
          const idx = this.pedidos.findIndex(p => p._id === id)
          if (idx !== -1) this.pedidos[idx] = normalizado
          return normalizado
        }
        return null
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
        const pedido = data?.pedido
        if (idx !== -1 && pedido) {
          const normalizado = {
            ...pedido,
            itens: Array.isArray(pedido.itens)
              ? pedido.itens.map(i => ({
                  ...i,
                  produtoId: typeof i.produtoId === 'object' && i.produtoId?._id
                    ? i.produtoId._id
                    : i.produtoId
                }))
              : []
          }
          this.pedidos[idx] = normalizado
          this.pedidos = [...this.pedidos]
        }
        return data?.pedido ?? null
      } catch (err) {
        this.pedidos = snapshot
        this.setErro(err)
        throw err
      }
    }
  }
})
