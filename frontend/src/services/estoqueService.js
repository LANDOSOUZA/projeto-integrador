// frontend/src/services/estoqueService.js
import api from './api'

export default {
  async listar() {
    // GET /admin/estoque → lista todos os produtos
    return api.get('/admin/estoque')
  },
  async repor(produtoId, pedidoId) {
    // POST /admin/estoque/repor → repõe estoque e atualiza pedido
    return api.post('/admin/estoque/repor', { produtoId, pedidoId })
  }
}


