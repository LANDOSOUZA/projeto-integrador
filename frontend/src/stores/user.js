import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(null)
  const user = ref(null)

  function setToken(newToken) {
    token.value = newToken
  }

  function setUser(newUser) {
    user.value = newUser
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('adminToken') // se estiver usando token de admin
  }

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

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
