// 📂 src/services/pedidoService.js
import api from './api'
import authHeader from './authHeader'

export default {
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
  // pedido deve conter clienteId e itens
  const { data } = await api.post('/pedido', pedido, { headers: authHeader() })
  return data // deve retornar { mensagem, pedido }
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

  async listarTodosPedidosAdmin() {
    return api.get('/pedido', { headers: authHeader() })
  },

  async liberarPedido(id) {
    return api.patch(`/pedido/liberar/${id}`, {}, { headers: authHeader() })
  },

  async excluirPedidosClienteAdmin(codigoCliente) {
    return api.delete(`/pedido/excluir/${codigoCliente}`, { headers: authHeader() })
  },

  async limparPedidos() {
    return api.delete('/pedido/limpar', { headers: authHeader() })
  },

  async gerarBalancete(periodo) {
    return api.get(`/pedido/balancete?periodo=${periodo}`, { headers: authHeader() })
  },

  async anteciparPedido(id) {
    return api.put(`/pedido/${id}/antecipar`, {}, { headers: authHeader() })
  },

  async atualizarStatusPedido(id, status) {
    return api.put(`/pedido/${id}/status`, { status }, { headers: authHeader() })
  },

  // ============================
  // 📌 Funcionalidades do Superadmin
  // ============================

  async listarTodosPedidosSuperadmin() {
    return api.get('/pedido/superadmin', { headers: authHeader() })
  },

  async excluirTodosPedidosSuperadmin() {
    return api.delete('/pedido/superadmin/excluir-todos', { headers: authHeader() })
  },

  // ============================
  // 📌 Funcionalidades do MES
  // ============================

  async reordenarFilaMES(pedidoId, dados) {
    return api.put(`/pedido/mes/${pedidoId}/reordenar`, dados, { headers: authHeader() })
  }
}
