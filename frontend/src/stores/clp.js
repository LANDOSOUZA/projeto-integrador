// 📂 src/stores/clp.js
import { defineStore } from 'pinia'
import clpService from '../services/clpService'

export const useClpStore = defineStore('clp', {
  state: () => ({
    status: {},     // dados retornados pelo backend
    loading: false, // indica se está carregando
    error: null     // mensagem de erro
  }),

  actions: {
    async lerStatus() {
      this.loading = true
      this.error = null
      try {
        // 🔎 rota de status do CLP
        const { data } = await clpService.lerStatus()
        this.status = data || {}
      } catch (err) {
        this.error = err.response?.data?.mensagem || err.message
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    // ✅ Getter para formatar alguns valores
    producaoInfo: (state) => {
      return {
        boas: state.status.mesPcsBoas ?? 0,
        ruins: state.status.mesPcsRuins ?? 0,
        ciclo: state.status.mesUltimoCiclo ? `${state.status.mesUltimoCiclo}s` : 'N/A'
      }
    }
  }
})
