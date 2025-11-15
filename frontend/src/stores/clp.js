// src/stores/clp.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useClpStore = defineStore('clp', {
  state: () => ({
    status: {},
    loading: false,
    error: null
  }),

  actions: {
    async lerStatus() {
      this.loading = true
      try {
        const { data } = await axios.get('/status')
        this.status = data
      } catch (err) {
        this.error = err.response?.data || err.message
      } finally {
        this.loading = false
      }
    }
  }
})
