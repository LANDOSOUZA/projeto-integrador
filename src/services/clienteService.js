// 📂 src/services/clienteService.js
import api from './api';
import authHeader from './authHeader';

export default {
  async cadastrarCliente(dados) {
    return api.post('/cliente/cadastrar', dados);   // ✅ corrigido
  },

  async loginCliente(dados) {
    return api.post('/cliente/login', dados);       // ✅ já estava certo
  },

  async listarClientes() {
    return api.get('/cliente/todos', { headers: authHeader() }); // ✅ corrigido
  },

  async atualizarCliente(id, dados) {
    return api.put(`/cliente/${id}`, dados, { headers: authHeader() });
  },

  async excluirCliente(id) {
    return api.delete(`/cliente/${id}`, { headers: authHeader() });
  }
};
