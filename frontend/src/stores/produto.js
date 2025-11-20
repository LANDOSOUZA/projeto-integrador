// 📂 src/stores/produto.js
import { defineStore } from 'pinia'
import produtoService from '../services/produtoService'

export const useProdutoStore = defineStore('produto', {
  state: () => ({
    produtos: [],
    produtoSelecionado: null,
    error: null,
    loading: false
  }),

  getters: {
    // Exemplo: lista ordenada por nome
    produtosOrdenados: (state) => [...state.produtos].sort((a, b) => a.nome.localeCompare(b.nome))
  },

  actions: {
    setErro(err) {
      console.error(err)
      this.error = err
    },

    async listarProdutos() {
      this.loading = true
      this.error = null
      try {
        const { data } = await produtoService.listarProdutos()
        // backend retorna { produtos: [...] }
        this.produtos = data.produtos ?? []
        if (this.produtoSelecionado) {
          const existe = this.produtos.some(p => p._id === this.produtoSelecionado._id)
          if (!existe) this.produtoSelecionado = null
        }
      } catch (err) {
        this.setErro(err)
      } finally {
        this.loading = false
      }
    },



    async detalharProduto(id) {
      this.error = null
      try {
        const { data } = await produtoService.detalharProduto(id)
        this.produtoSelecionado = data
      } catch (err) {
        this.setErro(err)
      }
    },

    async cadastrarProduto(dados) {
      this.error = null
      try {
        const { data } = await produtoService.cadastrarProduto(dados)
        if (data && (data._id || data.id)) {
          this.produtos.push(data)
        } else {
          await this.listarProdutos()
        }
        return data
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async atualizarProduto(id, dados) {
      this.error = null
      try {
        const { data } = await produtoService.atualizarProduto(id, dados)
        const i = this.produtos.findIndex(p => p._id === id)
        if (i !== -1) this.produtos[i] = data
        if (this.produtoSelecionado?._id === id) this.produtoSelecionado = data
        return data
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async atualizarStatusProduto(id, status) {
      this.error = null
      try {
        const { data } = await produtoService.atualizarStatusProduto(id, status)
        const i = this.produtos.findIndex(p => p._id === id)
        if (i !== -1) this.produtos[i].status = data.status ?? status
        if (this.produtoSelecionado?._id === id) {
          this.produtoSelecionado.status = data.status ?? status
        }
        return data
      } catch (err) {
        this.setErro(err)
        throw err
      }
    },

    async excluirProduto(id) {
      this.error = null
      const anterior = [...this.produtos]
      this.produtos = this.produtos.filter(p => p._id !== id)
      if (this.produtoSelecionado?._id === id) this.produtoSelecionado = null
      try {
        await produtoService.excluirProduto(id)
      } catch (err) {
        this.setErro(err)
        // Reverte estado em caso de falha
        this.produtos = anterior
        throw err
      }
    }
  }
})
