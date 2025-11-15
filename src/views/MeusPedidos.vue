<script setup>
import { onMounted } from 'vue'
import { usePedidosStore } from '../stores/pedidos'

const pedidoStore = usePedidosStore()

// 📋 Carregar pedidos ao montar
onMounted(() => {
  pedidoStore.carregarPedidos()
})

// ❌ Cancelar pedido
async function cancelarPedido(pedido) {
  try {
    await pedidoStore.cancelarPedido(pedido._id || pedido.id || pedido.codigoCliente)
    alert(`Pedido #${pedido.codigoCliente} cancelado com sucesso!`)
  } catch (err) {
    alert('Erro ao cancelar pedido')
  }
}

// 🔎 Quantidade de cada produto
function getQuantidade(pedido, produtoId) {
  const item = pedido.itens.find(i => i.produtoId === produtoId || i.produtoId?._id === produtoId)
  return item ? item.quantidade : 0
}

// 🗓️ Formatar data
function formatarData(data) {
  return new Date(data).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

// 🔖 Formatar status
function formatarStatus(status) {
  const mapa = {
    iniciado: 'Iniciado',
    em_processamento: 'Em processamento',
    pronto: 'Pronto',
    cancelado: 'Cancelado'
  }
  return mapa[status] || status
}

// ⚡ Superadmin: excluir todos os pedidos
async function excluirTodosPedidosSuperadmin() {
  try {
    await pedidoStore.excluirTodosPedidosSuperadmin()
    alert('Todos os pedidos foram excluídos pelo superadmin!')
  } catch (err) {
    alert('Erro ao excluir todos os pedidos')
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
        :key="pedido._id || pedido.id"
        class="mb-4 border-b pb-4"
      >
        <strong>Pedido #{{ pedido.codigoCliente }}</strong>

        <p>
          🍊 {{ getQuantidade(pedido, 1) }} |
          🍇 {{ getQuantidade(pedido, 2) }} |
          🍍 {{ getQuantidade(pedido, 3) }}
        </p>

        <p>Data: {{ formatarData(pedido.data) }}</p>
        <p>Status: {{ formatarStatus(pedido.status) }}</p>

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
    <div class="mt-6">
      <button
        @click="excluirTodosPedidosSuperadmin"
        class="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded"
      >
        🛑 Superadmin: Excluir todos os pedidos
      </button>
    </div>
  </div>
</template>
