// 📂 src/services/clienteService.js
import api from './api'
import authHeader from './authHeader'

export default {
  // 🔑 Login de cliente
  async loginCliente(dados) {
    const res = await api.post('/cliente/login', dados)
    return res.data
  },

  // 🆕 Cadastro de cliente
  async cadastrarCliente(dados) {
    const res = await api.post('/cliente/cadastrar', dados)
    return res.data
  },

  // 📋 Listar todos os clientes
  async listarUsuarios() {
    const res = await api.get('/cliente/todos', { headers: authHeader() })
    return res.data   // esperado: { usuarios: [...] }
  },

  // ⚡ Atualizar papel (role)
  async atualizarRole(id, role) {
    const res = await api.put(`/cliente/${id}/role`, { role }, { headers: authHeader() })
    return res.data
  },

  // ⚡ Atualizar status (ativo/inativo)
  async atualizarStatus(id, status) {
    const res = await api.put(`/cliente/${id}/status`, { status }, { headers: authHeader() })
    return res.data
  },

  // ❌ Excluir usuário
  async excluirUsuario(id) {
    const res = await api.delete(`/cliente/${id}`, { headers: authHeader() })
    return res.data
  }
}
