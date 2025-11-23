<!-- frontend/src/components/AdminPrincipal.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'
import { usePedidosStore } from '../stores/pedidos'
import EstoquePainel from './EstoquePainel.vue'
import PedidosPainel from './PedidosPainel.vue'
import { useToast } from 'vue-toastification'

const adminStore = useAdminStore()
const pedidoStore = usePedidosStore()
const toast = useToast()

const novoAdmin = ref({ nome: '', email: '', senha: '' })

// carregar pedidos e admins ao montar
onMounted(() => {
  pedidoStore.carregarPedidos()
  adminStore.listarAdmins()
})

// 🔄 Repor estoque
async function reporEstoque(pedido) {
  try {
    const produtoId = pedido.itens[0]?.produtoId || pedido.itens[0]?.produto?._id
    if (!produtoId) throw new Error('ProdutoId não encontrado no pedido')

    const response = await pedidoStore.reporEstoqueEPedido(pedido._id, produtoId)
    toast.success(response.message || '✅ Estoque reposto com sucesso!')
    await pedidoStore.carregarPedidos()
  } catch (err) {
    toast.error(`❌ Erro ao repor estoque do pedido ${pedido._id}: ${err.message}`)
  }
}

// 👑 Criar novo admin
async function criarNovoAdmin() {
  try {
    await adminStore.criarAdmin(novoAdmin.value)
    alert('✅ Admin criado com sucesso!')
    novoAdmin.value = { nome: '', email: '', senha: '' }
  } catch {
    alert('❌ Erro ao criar admin')
  }
}

// 🗑️ Excluir admin
async function excluirAdmin(id) {
  if (!confirm('Tem certeza que deseja excluir este admin?')) return
  try {
    await adminStore.excluirAdmin(id)
    alert('🗑️ Admin excluído com sucesso!')
  } catch {
    alert('❌ Erro ao excluir admin')
  }
}

// 🔄 Atualizar role
async function atualizarRole(id, role) {
  try {
    await adminStore.atualizarRoleUsuario(id, role)
    alert(`🔄 Role atualizado para ${role}!`)
  } catch {
    alert('❌ Erro ao atualizar role')
  }
}
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">👑 Painel do Superadmin</h2>

    <!-- Formulário de criação -->
    <form @submit.prevent="criarNovoAdmin" class="mb-6 flex gap-2">
      <input v-model="novoAdmin.nome" placeholder="Nome" class="border p-2 rounded w-1/4" />
      <input v-model="novoAdmin.email" placeholder="Email" class="border p-2 rounded w-1/3" />
      <input v-model="novoAdmin.senha" type="password" placeholder="Senha" class="border p-2 rounded w-1/4" />
      <button class="bg-purple-600 text-white px-4 py-2 rounded">Criar Admin</button>
    </form>

    <!-- Lista de admins -->
    <ul>
      <li 
        v-for="admin in adminStore.admins" 
        :key="admin._id" 
        class="flex justify-between items-center border-b py-2"
      >
        <span>{{ admin.nome }} — {{ admin.email }} ({{ admin.status }})</span>
        <div class="flex gap-2">
          <button @click="excluirAdmin(admin._id)" class="bg-red-500 text-white px-2 py-1 rounded">
            🗑️ Excluir
          </button>
          <button v-if="admin.status === 'admin'" @click="atualizarRole(admin._id, 'superadmin')" class="bg-blue-500 text-white px-2 py-1 rounded">
            🔼 Promover a Superadmin
          </button>
          <button v-if="admin.status === 'superadmin'" @click="atualizarRole(admin._id, 'admin')" class="bg-yellow-500 text-white px-2 py-1 rounded">
            🔽 Rebaixar para Admin
          </button>
        </div>
      </li>
    </ul>

    <p v-if="adminStore.error" class="text-red-600 mt-4">
      Erro: {{ adminStore.error.message || adminStore.error }}
    </p>
  </div>

  <!-- Painel de Pedidos -->
  <div class="mb-8">
    <PedidosPainel />
  </div>

  <!-- Painel de Estoque -->
  <div class="mb-8">
    <EstoquePainel />
  </div>
</template>
