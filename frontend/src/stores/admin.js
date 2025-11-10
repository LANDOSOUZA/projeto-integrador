import { defineStore } from 'pinia'
import adminService from '../services/adminService'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    admins: [],
    error: null,
    loading: false
  }),

  actions: {
    // 📋 Listar todos os admins
    async listarAdmins() {
      this.loading = true
      try {
        const { data } = await adminService.listarAdmins()
        this.admins = data.admins
      } catch (err) {
        this.error = err
        throw err
      } finally {
        this.loading = false
      }
    },

    // 👑 Criar novo admin
    async criarAdmin(dados) {
      try {
        const { data } = await adminService.criarAdmin(dados)
        this.admins.push(data.admin)
        return data.admin
      } catch (err) {
        this.error = err
        throw err
      }
    },

    // 🗑️ Excluir admin por ID
    async excluirAdmin(id) {
      try {
        await adminService.excluirAdmin(id)
        this.admins = this.admins.filter(a => a._id !== id)
      } catch (err) {
        this.error = err
        throw err
      }
    }
  }
})
