import { defineStore } from 'pinia'

export const useCarrinhoStore = defineStore('carrinho', {
  state: () => ({
    itens: [] // cada item: { _id, nome, preco, quantidade }
  }),

  getters: {
    total(state) {
      return state.itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0)
    },
    totalQuantidade(state) {
      return state.itens.reduce((acc, item) => acc + item.quantidade, 0)
    }
  },

  actions: {
    adicionar(produto) {
      const existente = this.itens.find(item => item._id === produto._id)
      const totalAtual = this.totalQuantidade

      if (totalAtual >= 3) return

      if (existente) {
        existente.quantidade++
      } else {
        this.itens.push({ ...produto, quantidade: 1 })
      }
    },

    remover(_id) {
      const item = this.itens.find(i => i._id === _id)
      if (!item) return

      if (item.quantidade > 1) {
        item.quantidade--
      } else {
        this.itens = this.itens.filter(i => i._id !== _id)
      }
    },

    limpar() {
      this.itens = []
    }
  },

  persist: true
})
