import api from './api'
import authHeader from './authHeader'

export default {
  // 👑 Criar novo admin (apenas admin principal)
  async criarAdmin(dados) {
    return api.post('/admin/criar', dados, { headers: authHeader() })
  },

  // 📋 Listar todos os admins
  async listarAdmins() {
    return api.get('/admin/listar', { headers: authHeader() })
  },

  // 🗑️ Excluir admin por ID
  async excluirAdmin(id) {
    return api.delete(`/admin/excluir/${id}`, { headers: authHeader() })
  }
}
