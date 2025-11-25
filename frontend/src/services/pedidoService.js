import api from './api'
import authHeader from './authHeader'

export default {
  // ============================
  // 📌 Funcionalidades Gerais
  // ============================
  async liberarParaProducao(id) {
    return api.put(`/pedido/admin/${id}/status`, { status: 'em_processamento' }, { headers: authHeader() })
  },

  // ============================
  // 📌 Funcionalidades do Cliente
  // ============================
  async cadastrarPedido(itens) {
    return api.post('/pedido', { itens }, { headers: authHeader() })
  },

  async listarPedidos() {
    return api.get('/pedido', { headers: authHeader() })
  },

  async historicoPedidos() {
    return api.get('/pedido/historico', { headers: authHeader() })
  },

  async cancelarPedido(id) {
    return api.patch(`/pedido/${id}/cancelar`, {}, { headers: authHeader() })
  },

  async finalizarCompra(itens) {
    const { data } = await api.post('/pedido', { itens }, { headers: authHeader() })
    return data
  },

  async limparPedidosCliente() {
    return api.delete('/pedido/limpar', { headers: authHeader() })
  },

  async detalharPedido(id) {
    return api.get(`/pedido/${id}`, { headers: authHeader() })
  },

  async atualizarPedido(id, dados) {
    return api.patch(`/pedido/${id}`, dados, { headers: authHeader() })
  },

  // ============================
  // 📌 Funcionalidades do Admin
  // ============================
  async limparPedidos() {
    return api.delete('/pedido/admin/limpar', { headers: authHeader() })
  },

  async gerarBalancete(periodo) {
    return api.get(`/pedido/admin/balancete?periodo=${periodo}`, { headers: authHeader() })
  },

  async anteciparPedido(id) {
    return api.put(`/pedido/admin/${id}/antecipar`, {}, { headers: authHeader() })
  },

  async atualizarStatusPedido(id, status) {
    return api.put(`/pedido/admin/${id}/status`, { status }, { headers: authHeader() })
  },

  async listarTodosPedidosAdmin() {
    return api.get('/pedido/admin', { headers: authHeader() })
  },

  // ============================
  // 📌 Funcionalidades do Superadmin
  // ============================
  async listarTodosPedidosSuperadmin() {
    // reaproveita rota de admin
    return this.listarTodosPedidosAdmin()
  },

  async excluirTodosPedidosSuperadmin() {
    // reaproveita rota de admin
    return this.limparPedidos()
  },

  // ============================
  // 📌 Funcionalidades do MES
  // ============================
  async reordenarFilaMES(pedidoId, dados) {
    return api.put(`/pedido/mes/${pedidoId}/reordenar`, dados, { headers: authHeader() })
  }
}
