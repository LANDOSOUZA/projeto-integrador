import api from './api'
import authHeader from './authHeader'

async function postCLP(endpoint, action) {
  try {
    return await api.post(`/clp/${endpoint}`, {}, { headers: authHeader() })
  } catch (err) {
    console.error(`Erro ao ${action}:`, err)
    throw err
  }
}

export default {
  async lerStatus() {
    try {
      return await api.get('/status', { headers: authHeader() })
    } catch (err) {
      console.error('Erro ao ler status do CLP:', err)
      throw err
    }
  },

  async iniciarProducao() {
    return postCLP('iniciar', 'iniciar produção')
  },

  async resetPLC() {
    return postCLP('reset', 'resetar PLC')
  },

  async abortarPedido() {
    return postCLP('abortar', 'abortar pedido')
  },

  // 👉 Nova função para atualizar status / repor estoque
  async atualizarStatusCLP(pedidoId, status, itemId) {
    try {
      return await api.post(
        '/clp/status',
        { pedidoId, status, itemId },   // corpo da requisição
        { headers: authHeader() }
      )
    } catch (err) {
      console.error('Erro ao atualizar status do CLP:', err)
      throw err
    }
  }
}
