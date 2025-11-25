import { defineStore } from 'pinia'

export const useCarrinhoStore = defineStore('carrinho', {
  state: () => ({
    itens: [] // cada item: { produtoId, nome, preco, quantidade }
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
      const idx = this.itens.findIndex(item => item.produtoId === produto._id)
      if (idx !== -1) {
        const atualizado = {
          ...this.itens[idx],
          quantidade: this.itens[idx].quantidade + 1
        }
        this.itens.splice(idx, 1, atualizado)
        this.itens = [...this.itens] // força reatividade
      } else {
        this.itens.push({
          produtoId: produto._id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 1
        })
      }
    },


    remover(produtoId) {
      const item = this.itens.find(i => i.produtoId === produtoId)
      if (!item) return

      if (item.quantidade > 1) {
        item.quantidade--
      } else {
        this.itens = this.itens.filter(i => i.produtoId !== produtoId)
      }
    },

    limpar() {
      this.itens = []
    }
  },
  
  persist: true
})
