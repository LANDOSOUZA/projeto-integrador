<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'
import { usePedidosStore } from '../stores/pedidos'

const adminStore = useAdminStore()
const pedidoStore = usePedidosStore()

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

// Promover usuário para admin ou superadmin
async function promoverUsuario(id, role) {
  try {
    await adminStore.atualizarRoleUsuario(id, role)
    alert(`✅ Usuário promovido para ${role}!`)
  } catch (err) {
    alert('❌ Erro ao promover usuário')
  }
}

// Carregar lista de admins ao montar
onMounted(() => {
  adminStore.listarAdmins()
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">👑 Área do SuperAdmin</h1>

    <!-- CRUD de Admins -->
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-4">Gerenciar Admins</h2>

      <!-- Formulário de criação -->
      <form @submit.prevent="criarNovoAdmin" class="mb-6 flex gap-2">
        <input v-model="novoAdmin.nome" placeholder="Nome" class="border p-2 rounded w-1/4" />
        <input v-model="novoAdmin.email" placeholder="Email" class="border p-2 rounded w-1/3" />
        <input v-model="novoAdmin.senha" type="password" placeholder="Senha" class="border p-2 rounded w-1/4" />
        <button class="bg-purple-600 text-white px-4 py-2 rounded">Criar Admin</button>
      </form>

      <!-- Lista de admins -->
      <h3 class="text-lg font-semibold mb-2">📋 Lista de Admins</h3>
      <ul>
        <li v-for="admin in adminStore.admins" :key="admin._id" class="flex justify-between items-center border-b py-2">
          <span>{{ admin.nome }} — {{ admin.email }} ({{ admin.role }})</span>
          <div class="flex gap-2">
            <button @click="promoverUsuario(admin._id, 'admin')" class="bg-blue-500 text-white px-2 py-1 rounded">
              🔄 Tornar Admin
            </button>
            <button @click="promoverUsuario(admin._id, 'superadmin')" class="bg-green-600 text-white px-2 py-1 rounded">
              👑 Tornar SuperAdmin
            </button>
            <button @click="excluirAdmin(admin._id)" class="bg-red-500 text-white px-2 py-1 rounded">
              🗑️ Excluir
            </button>
          </div>
        </li>
      </ul>

      <!-- Mensagem de erro -->
      <p v-if="adminStore.error" class="text-red-600 mt-4">
        Erro: {{ adminStore.error.message || adminStore.error }}
      </p>
    </section>

    <!-- Ações globais do sistema -->
    <section>
      <h2 class="text-xl font-semibold mb-4">Ações Globais</h2>
      <button
        @click="pedidoStore.excluirTodosPedidosSuperadmin"
        class="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded"
      >
        🛑 Excluir todos os pedidos
      </button>
    </section>
  </div>
</template>
