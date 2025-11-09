import api from './api' // seu axios configurado com baseURL

const authService = {
  async login(email, senha) {
    // Faz a requisição de login para o backend
    const { data } = await api.post('/login', { email, senha })

    // Salva o token no localStorage
    localStorage.setItem('token', data.token)

    // Retorna os dados do usuário para o store
    return data.usuario
  },

  logout() {
    // Remove o token do localStorage
    localStorage.removeItem('token')
  },

  getToken() {
    // Recupera o token salvo
    return localStorage.getItem('token')
  },

  isAuthenticated() {
    // Verifica se existe token válido
    return !!localStorage.getItem('token')
  }
}

export default authService
