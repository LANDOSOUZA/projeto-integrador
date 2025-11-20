// 📂 src/services/adminService.js
import api from './api'
import authHeader from './authHeader'

export default {
  // 👑 Criar novo admin (apenas superadmin)
  async criarAdmin(dados) {
    try {
      return await api.post('/admin/criar', dados, { headers: authHeader() })
    } catch (err) {
      console.error('Erro ao criar admin:', err)
      throw err
    }
  },

  // 📋 Listar todos os admins (apenas superadmin)
  async listarAdmins() {
    try {
      return await api.get('/admin/listar', { headers: authHeader() })
    } catch (err) {
      console.error('Erro ao listar admins:', err)
      throw err
    }
  },

  // 🗑️ Excluir admin por ID (apenas superadmin)
  async excluirAdmin(id) {
    try {
      return await api.delete(`/admin/excluir/${id}`, { headers: authHeader() })
    } catch (err) {
      console.error(`Erro ao excluir admin ${id}:`, err)
      throw err
    }
  },

  // 🔄 Atualizar papel de um usuário (apenas superadmin)
  async atualizarRoleUsuario(id, role) {
    try {
      return await api.put(`/admin/atualizar-role/${id}`, { role }, { headers: authHeader() })
    } catch (err) {
      console.error(`Erro ao atualizar role do usuário ${id}:`, err)
      throw err
    }
  }
}

