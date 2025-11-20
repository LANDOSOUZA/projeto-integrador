// 📂 src/views/SuperAdmin.vue
<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'
import { usePedidosStore } from '../stores/pedidos'
import { useToast } from 'vue-toastification'
import clpService from '../services/clpService'   // ✅ novo service

const toast = useToast()

// Stores
const adminStore = useAdminStore()
const pedidoStore = usePedidosStore()

// Dados do novo admin
const novoAdmin = ref({ nome: '', email: '', senha: '' })
const loadingCriar = ref(false)
const loadingExcluir = ref(false)
const loadingPromover = ref(false)

// Criar novo admin
async function criarNovoAdmin() {
  loadingCriar.value = true
  try {
    await adminStore.criarAdmin(novoAdmin.value)
    toast.success('✅ Admin criado com sucesso!')
    novoAdmin.value = { nome: '', email: '', senha: '' }
  } catch (err) {
    toast.error('❌ Erro ao criar admin')
  } finally {
    loadingCriar.value = false
  }
}

// Excluir admin
async function excluirAdmin(id) {
  if (!confirm('Tem certeza que deseja excluir este admin?')) return
  loadingExcluir.value = true
  try {
    await adminStore.excluirAdmin(id)
    toast.success('🗑️ Admin excluído com sucesso!')
  } catch (err) {
    toast.error('❌ Erro ao excluir admin')
  } finally {
    loadingExcluir.value = false
  }
}

// Promover usuário
async function promoverUsuario(id, role) {
  loadingPromover.value = true
  try {
    await adminStore.atualizarRoleUsuario(id, role)
    toast.success(`✅ Usuário promovido para ${role}!`)
  } catch (err) {
    toast.error('❌ Erro ao promover usuário')
  } finally {
    loadingPromover.value = false
  }
}

// Carregar lista de admins
onMounted(() => {
  adminStore.listarAdmins()
})

// --- 🔌 Controle CLP ---
const loadingProducao = ref(false)
const loadingReset = ref(false)
const loadingAbortar = ref(false)

async function iniciarProducao() {
  loadingProducao.value = true
  try {
    await clpService.iniciarProducao()
    toast.success('🚀 Produção iniciada!')
  } catch (err) {
    toast.error('❌ Erro ao iniciar produção')
  } finally {
    loadingProducao.value = false
  }
}

async function resetPLC() {
  loadingReset.value = true
  try {
    await clpService.resetPLC()
    toast.success('🔄 PLC resetado!')
  } catch (err) {
    toast.error('❌ Erro ao resetar PLC')
  } finally {
    loadingReset.value = false
  }
}

async function abortarPedido() {
  loadingAbortar.value = true
  try {
    await clpService.abortarPedido()
    toast.success('🛑 Pedido abortado!')
  } catch (err) {
    toast.error('❌ Erro ao abortar pedido')
  } finally {
    loadingAbortar.value = false
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
          <input v-model="novoAdmin.nome" placeholder="Nome" class="border p-2 rounded w-1/4" autocomplete="name" />
          <input v-model="novoAdmin.email" type="email" placeholder="Email" class="border p-2 rounded w-1/3" autocomplete="email" />
          <input v-model="novoAdmin.senha" type="password" placeholder="Senha" class="border p-2 rounded w-1/4" autocomplete="new-password" />
          <button class="bg-purple-600 text-white px-4 py-2 rounded" :disabled="loadingCriar">
            {{ loadingCriar ? '⏳ Criando...' : 'Criar Admin' }}
          </button>
        </form>

        <!-- Lista -->
        <ul>
          <li v-for="admin in adminStore.admins" :key="admin._id" class="flex justify-between items-center border-b py-2">
            <span>{{ admin.nome }} — {{ admin.email }} ({{ admin.role }})</span>
            <div class="flex gap-2">
              <button @click="promoverUsuario(admin._id, 'admin')" class="bg-blue-500 text-white px-2 py-1 rounded" :disabled="loadingPromover">
                {{ loadingPromover ? '⏳...' : '🔄 Tornar Admin' }}
              </button>
              <button @click="promoverUsuario(admin._id, 'superadmin')" class="bg-green-600 text-white px-2 py-1 rounded" :disabled="loadingPromover">
                {{ loadingPromover ? '⏳...' : '👑 Tornar SuperAdmin' }}
              </button>
              <button @click="excluirAdmin(admin._id)" class="bg-red-500 text-white px-2 py-1 rounded" :disabled="loadingExcluir">
                {{ loadingExcluir ? '⏳...' : '🗑️ Excluir' }}
              </button>
            </div>
          </li>
        </ul>
      </section>

      <!-- Ações globais -->
      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4">Ações Globais</h2>
        <button @click="pedidoStore.excluirTodosPedidosSuperadmin" class="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded">
          🛑 Excluir todos os pedidos
        </button>
      </section>

      <!-- 🔌 Controle do CLP -->
      <section>
        <h2 class="text-xl font-semibold mb-4">Controle do CLP</h2>
        <div class="flex gap-4">
          <button @click="iniciarProducao" class="bg-green-600 text-white px-4 py-2 rounded" :disabled="loadingProducao">
            {{ loadingProducao ? '⏳ Iniciando...' : '🚀 Iniciar Produção' }}
          </button>
          <button @click="resetPLC" class="bg-yellow-500 text-white px-4 py-2 rounded" :disabled="loadingReset">
            {{ loadingReset ? '⏳ Resetando...' : '🔄 Resetar PLC' }}
          </button>
          <button @click="abortarPedido" class="bg-red-600 text-white px-4 py-2 rounded" :disabled="loadingAbortar">
            {{ loadingAbortar ? '⏳ Abortando...' : '🛑 Abortar Pedido' }}
          </button>
        </div>
      </section>
    </main>
  </div>
</template>
