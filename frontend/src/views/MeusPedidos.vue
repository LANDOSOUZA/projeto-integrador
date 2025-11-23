<script setup>
import { onMounted } from 'vue'
import { usePedidosStore } from '../stores/pedidos'
import { useUserStore } from '../stores/user'
import { useToast } from 'vue-toastification'

const pedidoStore = usePedidosStore()
const userStore = useUserStore()
const toast = useToast()

// 📋 Carregar pedidos ao montar
onMounted(() => {
  pedidoStore.carregarPedidos()
})

// ❌ Cancelar pedido
async function cancelarPedido(pedido) {
  try {
    await pedidoStore.cancelarPedido(pedido._id)   // ✅ usa sempre o _id
    toast.success(`✅ Pedido #${pedido.codigoCliente} cancelado com sucesso!`)
  } catch (err) {
    toast.error('❌ Erro ao cancelar pedido')
  }
}

// ⚡ Superadmin: excluir todos os pedidos
async function excluirTodosPedidosSuperadmin() {
  try {
    await pedidoStore.excluirTodosPedidosSuperadmin()
    toast.success('🛑 Todos os pedidos foram excluídos pelo superadmin!')
  } catch (err) {
    toast.error('❌ Erro ao excluir todos os pedidos')
  }
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">📦 Meus Pedidos</h1>

    <!-- Feedback de carregamento -->
    <div v-if="pedidoStore.loading" class="text-gray-500 mb-4">
      Carregando pedidos...
    </div>

    <!-- Feedback de erro -->
    <div v-if="pedidoStore.error" class="text-red-500 mb-4">
      Erro: {{ pedidoStore.error.message || pedidoStore.error }}
    </div>

    <!-- Lista de pedidos -->
    <ul v-if="!pedidoStore.loading && pedidoStore.pedidos.length">
      <li
        v-for="pedido in pedidoStore.pedidos"
        :key="pedido._id"
        class="mb-4 border-b pb-4"
      >
        <strong>Pedido #{{ pedido.codigoCliente }}</strong>

        <p>
          🍊 {{ pedidoStore.getQuantidade(pedido, 1) }} |
          🍇 {{ pedidoStore.getQuantidade(pedido, 2) }} |
          🍍 {{ pedidoStore.getQuantidade(pedido, 3) }}
        </p>

        <p>Data: {{ pedidoStore.formatarData(pedido.data) }}</p>
        <p>Status: {{ pedidoStore.formatarStatus(pedido.status) }}</p>

        <button
          v-if="pedido.status === 'iniciado' || pedido.status === 'em_processamento'"
          @click="cancelarPedido(pedido)"
          :aria-label="`Cancelar pedido ${pedido.codigoCliente}`"
          class="bg-[#C8102E] hover:bg-[#E32636] text-white px-3 py-1 rounded mt-2"
        >
          ❌ Cancelar
        </button>
      </li>
    </ul>

    <!-- Nenhum pedido -->
    <p v-else-if="!pedidoStore.loading" class="text-gray-500">
      Você ainda não possui pedidos. Faça seu primeiro pedido e acompanhe aqui!
    </p>

    <!-- Superadmin: ação global -->
    <div v-if="userStore.isSuperAdmin" class="mt-6"> <!-- ✅ só superadmin vê -->
      <button
        @click="excluirTodosPedidosSuperadmin"
        class="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded"
      >
        🛑 Superadmin: Excluir todos os pedidos
      </button>
    </div>
  </div>
</template>
