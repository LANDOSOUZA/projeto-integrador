import { defineStore } from 'pinia'
import adminService from '../services/adminService'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    admins: [],
    error: null,
    loading: false
  }),

  actions: {
    setErro(err) {
      console.error(err)
      this.error = err
    },

    // 📋 Listar todos os admins
    async listarAdmins() {
      this.loading = true
      this.error = null
      try {
        const { data } = await adminService.listarAdmins()
        this.admins = data.admins
      } catch (err) {
        this.setErro(err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // 👑 Criar novo admin
    async criarAdmin(dados) {
      this.loading = true
      this.error = null
      try {
        const { data } = await adminService.criarAdmin(dados)
        if (data?.admin?._id) {
          this.admins.push(data.admin)
        } else {
          await this.listarAdmins()
        }
        return data.admin
      } catch (err) {
        this.setErro(err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // 🗑️ Excluir admin por ID
    async excluirAdmin(id) {
      this.loading = true
      this.error = null
      const anterior = [...this.admins]
      this.admins = this.admins.filter(a => a._id !== id)
      try {
        await adminService.excluirAdmin(id)
      } catch (err) {
        this.setErro(err)
        this.admins = anterior // reverte em caso de falha
        throw err
      } finally {
        this.loading = false
      }
    },

    // 🔄 Atualizar papel de um usuário (promover para admin/superadmin)
    async atualizarRoleUsuario(id, role) {
      this.loading = true
      this.error = null
      try {
        const { data } = await adminService.atualizarRoleUsuario(id, role)
        const i = this.admins.findIndex(a => a._id === id)
        if (i !== -1) {
          this.admins[i].role = data.role
        }
        return data
      } catch (err) {
        this.setErro(err)
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
