<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'

const adminStore = useAdminStore()

// Dados do novo admin
const novoAdmin = ref({
  nome: '',
  email: '',
  senha: ''
})

// Criar novo admin
async function criarNovoAdmin() {
  try {
    await adminStore.criarAdmin(novoAdmin.value)
    alert('✅ Admin criado com sucesso!')
    novoAdmin.value = { nome: '', email: '', senha: '' }
  } catch (err) {
    alert('❌ Erro ao criar admin')
  }
}

// Excluir admin
async function excluirAdmin(id) {
  if (!confirm('Tem certeza que deseja excluir este admin?')) return
  try {
    await adminStore.excluirAdmin(id)
    alert('🗑️ Admin excluído com sucesso!')
  } catch (err) {
    alert('❌ Erro ao excluir admin')
  }
}

// Carregar lista de admins ao montar
onMounted(() => {
  adminStore.listarAdmins()
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">👑 Painel do Admin Principal</h1>

    <!-- Formulário de criação -->
    <form @submit.prevent="criarNovoAdmin" class="mb-6 flex gap-2">
      <input v-model="novoAdmin.nome" placeholder="Nome" class="border p-2 rounded w-1/4" />
      <input v-model="novoAdmin.email" placeholder="Email" class="border p-2 rounded w-1/3" />
      <input v-model="novoAdmin.senha" type="password" placeholder="Senha" class="border p-2 rounded w-1/4" />
      <button class="bg-purple-600 text-white px-4 py-2 rounded">Criar Admin</button>
    </form>

    <!-- Lista de admins -->
    <h2 class="text-xl font-semibold mb-2">📋 Lista de Admins</h2>
    <ul>
      <li v-for="admin in adminStore.admins" :key="admin._id" class="flex justify-between items-center border-b py-2">
        <span>{{ admin.nome }} — {{ admin.email }}</span>
        <button @click="excluirAdmin(admin._id)" class="bg-red-500 text-white px-2 py-1 rounded">
          🗑️ Excluir
        </button>
      </li>
    </ul>

    <!-- Mensagem de erro -->
    <p v-if="adminStore.error" class="text-red-600 mt-4">
      Erro: {{ adminStore.error.message || adminStore.error }}
    </p>
  </div>
</template>
