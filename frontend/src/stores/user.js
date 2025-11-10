import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import clienteService from '../services/clienteService'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || null)

  let savedUser = null
  try {
    const rawUser = localStorage.getItem('user')
    if (rawUser) savedUser = JSON.parse(rawUser)
  } catch (e) {
    savedUser = null
  }
  const user = ref(savedUser)

  const error = ref(null)

  async function login(dados) {
    const { data } = await clienteService.loginCliente(dados)
    setToken(data.token)
    setUser(data.user)
    error.value = null
    return data
  }

  async function cadastrar(dados) {
    const { data } = await clienteService.cadastrarCliente(dados)
    setToken(data.token)
    setUser(data.user)
    error.value = null
    return data
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

  return { token, user, error, login, cadastrar, setToken, setUser, logout, isAuthenticated, isAdmin, isSuperAdmin }
})
