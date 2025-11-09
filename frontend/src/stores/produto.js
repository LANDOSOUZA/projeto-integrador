import { defineStore } from 'pinia'
import produtoService from '../services/produtoService'

export const useProdutoStore = defineStore('produto', {
  state: () => ({
    produtos: [],
    produtoSelecionado: null,
    error: null,
    loading: false
  }),
  actions: {
    async listarProdutos() {
      this.loading = true
      try {
        const { data } = await produtoService.listarProdutos()
        this.produtos = data.produtos || data // depende da resposta do backend
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async detalharProduto(id) {
      try {
        const { data } = await produtoService.detalharProduto(id)
        this.produtoSelecionado = data
      } catch (err) {
        this.error = err
      }
    },
    async cadastrarProduto(dados) {
      return await produtoService.cadastrarProduto(dados)
    },
    async atualizarProduto(id, dados) {
      return await produtoService.atualizarProduto(id, dados)
    },
    async atualizarStatusProduto(id, status) {
      return await produtoService.atualizarStatusProduto(id, status)
    },
    async excluirProduto(id) {
      await produtoService.excluirProduto(id)
      this.produtos = this.produtos.filter(p => p._id !== id)
    }
  }
})
