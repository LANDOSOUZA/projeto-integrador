// frontend/src/components/AdminPrincipal.vue
<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'

const adminStore = useAdminStore()
const novoAdmin = ref({ nome: '', email: '', senha: '' })

async function criarNovoAdmin() {
  try {
    await adminStore.criarAdmin(novoAdmin.value)
    novoAdmin.value = { nome: '', email: '', senha: '' }
    alert('✅ Admin criado com sucesso!')
  } catch {
    alert('❌ Erro ao criar admin')
  }
}

async function excluirAdmin(id) {
  if (!confirm('Tem certeza que deseja excluir este admin?')) return
  try {
    await adminStore.excluirAdmin(id)
    alert('🗑️ Admin excluído com sucesso!')
  } catch {
    alert('❌ Erro ao excluir admin')
  }
}

onMounted(() => adminStore.listarAdmins())
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">👑 Gerenciar Admins</h2>

    <form @submit.prevent="criarNovoAdmin" class="mb-6 flex gap-2">
      <input v-model="novoAdmin.nome" placeholder="Nome" class="border p-2 rounded w-1/4" />
      <input v-model="novoAdmin.email" placeholder="Email" class="border p-2 rounded w-1/3" />
      <input v-model="novoAdmin.senha" type="password" placeholder="Senha" class="border p-2 rounded w-1/4" />
      <button class="bg-purple-600 text-white px-4 py-2 rounded">Criar Admin</button>
    </form>

    <ul>
      <li v-for="admin in adminStore.admins" :key="admin._id" class="flex justify-between items-center border-b py-2">
        <span>{{ admin.nome }} — {{ admin.email }} ({{ admin.status }})</span>
        <div class="flex gap-2">
          <button @click="excluirAdmin(admin._id)" class="bg-red-500 text-white px-2 py-1 rounded">
            🗑️ Excluir
          </button>
          <button 
            v-if="admin.status === 'admin'" 
            @click="adminStore.atualizarRoleUsuario(admin._id, 'superadmin')" 
            class="bg-blue-500 text-white px-2 py-1 rounded"
          >
            🔄 Promover
          </button>
        </div>
      </li>
    </ul>

    <p v-if="adminStore.error" class="text-red-600 mt-4">
      Erro: {{ adminStore.error.message || adminStore.error }}
    </p>
  </div>
</template>
