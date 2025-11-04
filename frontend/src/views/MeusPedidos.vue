<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">📦 Meus Pedidos</h1>

    <!-- Lista de pedidos -->
    <ul v-if="pedidos.length">
      <li
        v-for="pedido in pedidos"
        :key="pedido.id || pedido._id"
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
          class="bg-[#C8102E] hover:bg-[#E32636] text-white px-3 py-1 rounded mt-2"
        >
          ❌ Cancelar
        </button>
      </li>
    </ul>

    <!-- Nenhum pedido -->
    <p v-else>Nenhum pedido encontrado.</p>

    <!-- Logs -->
    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-2">📜 Logs</h2>
      <ul class="list-disc pl-6">
        <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../services/api'
import { useUserStore } from '../stores/user'

const pedidos = ref([])
const logs = ref([])
const userStore = useUserStore()

function authHeaders() {
  return {
    headers: { Authorization: `Bearer ${userStore.token}` }
  }
}

// 📋 Carregar pedidos
async function carregarPedidos() {
  try {
    const { data } = await api.get('/pedido', authHeaders())
    console.log('📋 Resposta do backend:', data)
    pedidos.value = data.pedidos || []
  } catch (err) {
    console.error('Erro ao carregar pedidos', err)
  }
}

// ❌ Cancelar pedido
async function cancelarPedido(pedido) {
  try {
    // use pedido.id ou pedido.codigoCliente dependendo do backend
    const pedidoId = pedido.id || pedido.codigoCliente || pedido._id
    const { data } = await api.delete(`/pedido/${pedidoId}`, authHeaders())

    pedido.status = 'cancelado'
    logs.value.push(`Pedido #${pedido.codigoCliente} foi cancelado`)
    alert(data.mensagem || 'Pedido cancelado com sucesso!')
  } catch (err) {
    console.error('Erro ao cancelar pedido', err)
    alert(err.response?.data?.mensagem || 'Erro ao cancelar pedido')
  }
}

// 🔎 Quantidade de cada produto
function getQuantidade(pedido, produtoId) {
  const item = pedido.itens.find(i => i.produtoId === produtoId || i.produtoId?.id === produtoId)
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

onMounted(() => {
  carregarPedidos()
})
</script>
