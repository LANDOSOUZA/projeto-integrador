// 📂 src/services/produtoService.js
import api from './api';
import authHeader from './authHeader';

export default {
  cadastrarProduto(dados) {
    return api.post('/produto/cadastrar', dados, { headers: authHeader() }); // ✅ corrigido
  },

  listarProdutos() {
    return api.get('/produto', { headers: authHeader() });
  },

  detalharProduto(id) {
    return api.get(`/produto/${id}`, { headers: authHeader() });
  },

  listarProdutosPorCategoria(nomeCategoria) {
    return api.get(`/produto/categoria/${nomeCategoria}`, { headers: authHeader() });
  },

  atualizarProduto(id, dados) {
    return api.put(`/produto/${id}`, dados, { headers: authHeader() });
  },

  atualizarStatusProduto(id, status) {
    return api.patch(`/produto/${id}/status`, { status }, { headers: authHeader() });
  },

  excluirProduto(id) {
    return api.delete(`/produto/${id}`, { headers: authHeader() });
  }
};

