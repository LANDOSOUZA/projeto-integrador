import api from './api' // seu axios configurado com baseURL
import jwtDecode from 'jwt-decode'
import authHeader from './authHeader'

const authService = {
  async login(email, senha) {
    const { data } = await api.post('/login', { email, senha })
    localStorage.setItem('token', data.token)
    localStorage.setItem('role', data.usuario.role) // salva papel do usuário
    return data.usuario
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  },

  getToken() {
    return localStorage.getItem('token')
  },

  getRole() {
    return localStorage.getItem('role')
  },

  isAuthenticated() {
    const token = localStorage.getItem('token')
    if (!token) return false
    try {
      const { exp } = jwtDecode(token)
      return Date.now() < exp * 1000
    } catch {
      return false
    }
  },

  async refreshToken() {
    const { data } = await api.post('/refresh', {}, { headers: authHeader() })
    localStorage.setItem('token', data.token)
    return data.token
  }
}

export default authService
