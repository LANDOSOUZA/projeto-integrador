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
      const existente = this.itens.find(item => item.produtoId === produto._id)
      const totalAtual = this.totalQuantidade

      if (totalAtual >= 3) return

      if (existente) {
        existente.quantidade++
      } else {
        this.itens.push({
          produtoId: produto._id,   // 👉 garante que o backend receba o ID certo
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
