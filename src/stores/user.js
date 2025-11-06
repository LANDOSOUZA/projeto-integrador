import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 🔑 Inicializa o token e o user a partir do localStorage
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

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
  const isAdmin = computed(() => user.value?.status === 'admin') // 👈 corrigido

  return {
    token,
    user,
    setToken,
    setUser,
    logout,
    isAuthenticated,
    isAdmin
  }
})
