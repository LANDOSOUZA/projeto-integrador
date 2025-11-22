// 📂 src/services/estoqueService.js
import api from './api'

export default {
  async listar() {
    return api.get('/pedido/estoque')
  },
  async repor(produtoId, quantidade = 3) {
    return api.post('/admin/repor', { produtoId, quantidade })
  }
}

