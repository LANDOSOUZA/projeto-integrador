// 📂 src/services/produtoService.js
import api from './api'
import authHeader from './authHeader'

export default {
  // ============================
  // 📌 Funcionalidades de Produtos
  // ============================

  // Lista todos os produtos
  async listarProdutos() {
    return api.get('/produto', { headers: authHeader() })
  },

  // Detalha um produto específico
  async detalharProduto(id) {
    return api.get(`/produto/${id}`, { headers: authHeader() })
  },

  // Cadastra um novo produto
  async cadastrarProduto(dados) {
    return api.post('/produto', dados, { headers: authHeader() })
  },

  // Atualiza um produto existente
  async atualizarProduto(id, dados) {
    return api.put(`/produto/${id}`, dados, { headers: authHeader() })
  },

  // Atualiza apenas o status de um produto
  async atualizarStatusProduto(id, status) {
    return api.patch(`/produto/${id}/status`, { status }, { headers: authHeader() })
  },

  // Exclui um produto
  async excluirProduto(id) {
    return api.delete(`/produto/${id}`, { headers: authHeader() })
  }
}


