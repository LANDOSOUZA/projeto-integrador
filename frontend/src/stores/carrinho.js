import { defineStore } from 'pinia'

export const useCarrinhoStore = defineStore('carrinho', {
  state: () => ({
    itens: []
  }),
  actions: {
    adicionar(produto) {
      this.itens.push(produto)
    },
    limpar() {
      this.itens = []
    }
  }
})
