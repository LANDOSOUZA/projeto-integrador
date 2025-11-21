// 📂 src/services/clpService.js
import api from './api'
import authHeader from './authHeader'

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
    try {
      return await api.post('/clp/iniciar', {}, { headers: authHeader() })
    } catch (err) {
      console.error('Erro ao iniciar produção:', err)
      throw err
    }
  },

  async resetPLC() {
    try {
      return await api.post('/clp/reset', {}, { headers: authHeader() })
    } catch (err) {
      console.error('Erro ao resetar PLC:', err)
      throw err
    }
  },

  async abortarPedido() {
    try {
      return await api.post('/clp/abortar', {}, { headers: authHeader() })
    } catch (err) {
      console.error('Erro ao abortar pedido:', err)
      throw err
    }
  }
}
