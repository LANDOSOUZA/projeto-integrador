<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'
import { usePedidosStore } from '../stores/pedidos'
import axios from 'axios'

// Stores
const adminStore = useAdminStore()
const pedidoStore = usePedidosStore()

// Dados do novo admin
const novoAdmin = ref({ nome: '', email: '', senha: '' })

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

// Promover usuário
async function promoverUsuario(id, role) {
  try {
    await adminStore.atualizarRoleUsuario(id, role)
    alert(`✅ Usuário promovido para ${role}!`)
  } catch (err) {
    alert('❌ Erro ao promover usuário')
  }
}

// Carregar lista de admins
onMounted(() => {
  adminStore.listarAdmins()
})

// --- 🔌 Controle CLP ---
async function iniciarProducao() {
  try {
    await axios.post('/clp/iniciar')
    alert('🚀 Produção iniciada!')
  } catch (err) {
    alert('❌ Erro ao iniciar produção')
  }
}

async function resetPLC() {
  try {
    await axios.post('/clp/reset')
    alert('🔄 PLC resetado!')
  } catch (err) {
    alert('❌ Erro ao resetar PLC')
  }
}

async function abortarPedido() {
  try {
    await axios.post('/clp/abortar')
    alert('🛑 Pedido abortado!')
  } catch (err) {
    alert('❌ Erro ao abortar pedido')
  }
}
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#005CA9] text-white flex flex-col p-4">
      <h2 class="text-xl font-bold mb-6">👑 SuperAdmin</h2>
      <nav class="flex flex-col gap-3">
        <button class="text-left hover:bg-blue-700 p-2 rounded">📋 Admins</button>
        <button class="text-left hover:bg-blue-700 p-2 rounded">🛒 Pedidos</button>
        <button class="text-left hover:bg-blue-700 p-2 rounded">📦 Produtos</button>
        <button class="text-left hover:bg-blue-700 p-2 rounded">⚙️ Configurações</button>
      </nav>
    </aside>

    <!-- Conteúdo principal -->
    <main class="flex-1 p-6 overflow-y-auto">
      <h1 class="text-3xl font-bold text-[#005CA9] mb-6">Painel do SuperAdmin</h1>

      <!-- CRUD de Admins -->
      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4">Gerenciar Admins</h2>

        <!-- Formulário -->
        <form @submit.prevent="criarNovoAdmin" class="mb-6 flex gap-2">
          <input v-model="novoAdmin.nome" placeholder="Nome" class="border p-2 rounded w-1/4" />
          <input v-model="novoAdmin.email" placeholder="Email" class="border p-2 rounded w-1/3" />
          <input v-model="novoAdmin.senha" type="password" placeholder="Senha" class="border p-2 rounded w-1/4" />
          <button class="bg-purple-600 text-white px-4 py-2 rounded">Criar Admin</button>
        </form>

        <!-- Lista -->
        <ul>
          <li
            v-for="admin in adminStore.admins"
            :key="admin._id"
            class="flex justify-between items-center border-b py-2"
          >
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
      </section>

      <!-- Ações globais -->
      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4">Ações Globais</h2>
        <button
          @click="pedidoStore.excluirTodosPedidosSuperadmin"
          class="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded"
        >
          🛑 Excluir todos os pedidos
        </button>
      </section>

      <!-- 🔌 Controle do CLP -->
      <section>
        <h2 class="text-xl font-semibold mb-4">Controle do CLP</h2>
        <div class="flex gap-4">
          <button @click="iniciarProducao" class="bg-green-600 text-white px-4 py-2 rounded">
            🚀 Iniciar Produção
          </button>
          <button @click="resetPLC" class="bg-yellow-500 text-white px-4 py-2 rounded">
            🔄 Resetar PLC
          </button>
          <button @click="abortarPedido" class="bg-red-600 text-white px-4 py-2 rounded">
            🛑 Abortar Pedido
          </button>
        </div>
      </section>
    </main>
  </div>
</template>
