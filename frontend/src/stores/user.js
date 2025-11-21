import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import clienteService from '../services/clienteService'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || null)

  let savedUser = null
  try {
    const rawUser = localStorage.getItem('user')
    if (rawUser) savedUser = JSON.parse(rawUser)
  } catch {
    savedUser = null
  }
  const user = ref(savedUser)

  const usuarios = ref([])   // ✅ lista de usuários
  const error = ref(null)

  async function login(dados) {
    try {
      const res = await clienteService.loginCliente(dados)
      setToken(res.token)
      setUser(res.user)
      error.value = null
      return res
    } catch (err) {
      error.value = err.response?.data || err
      throw err
    }
  }

  async function cadastrar(dados) {
    try {
      const res = await clienteService.cadastrarCliente(dados)
      setToken(res.token)
      setUser(res.user)
      error.value = null
      return res
    } catch (err) {
      error.value = err.response?.data || err
      throw err
    }
  }

  // 📋 Listar todos os usuários
  async function listarUsuarios() {
    try {
      const res = await clienteService.listarUsuarios()
      usuarios.value = res.usuarios || []   // esperado: { usuarios: [...] }
      error.value = null
      return usuarios.value
    } catch (err) {
      error.value = err.response?.data || err
      throw err
    }
  }

  // ⚡ Atualizar papel (role)
  async function atualizarRole(id, role) {
    try {
      await clienteService.atualizarRole(id, role)
      await listarUsuarios()
    } catch (err) {
      error.value = err.response?.data || err
      throw err
    }
  }

  // ⚡ Atualizar status
  async function atualizarStatus(id, status) {
    try {
      await clienteService.atualizarStatus(id, status)
      await listarUsuarios()
    } catch (err) {
      error.value = err.response?.data || err
      throw err
    }
  }

  // ❌ Excluir usuário
  async function excluirUsuario(id) {
    try {
      await clienteService.excluirUsuario(id)
      await listarUsuarios()
    } catch (err) {
      error.value = err.response?.data || err
      throw err
    }
  }

  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function setUser(newUser) {
    user.value = newUser
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.status === 'admin' || user.value?.status === 'superadmin')
  const isSuperAdmin = computed(() => user.value?.status === 'superadmin')

  return {
    token, user, usuarios, error,
    login, cadastrar, listarUsuarios,
    atualizarRole, atualizarStatus, excluirUsuario,
    setToken, setUser, logout,
    isAuthenticated, isAdmin, isSuperAdmin
  }
})
