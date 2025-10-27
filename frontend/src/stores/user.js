import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(null)
  const user = ref(null)

  function setToken(newToken) {
    token.value = newToken
  }

  function setUser(newUser) {
    user.value = newUser
  }

  return { token, user, setToken, setUser }
})
