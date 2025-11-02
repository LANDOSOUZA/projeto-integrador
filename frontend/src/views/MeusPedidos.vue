<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">📦 Meus Pedidos</h1>

    <ul v-if="pedidos.length">
      <li
        v-for="pedido in pedidos"
        :key="pedido._id"
        class="mb-4 border-b pb-4"
      >
        <strong>Pedido #{{ pedido._id }}</strong>
        <p>
          🍊 {{ pedido.laranja || 0 }} |
          🍇 {{ pedido.uva || 0 }} |
          🍍 {{ pedido.abacaxi || 0 }}
        </p>
        <p>Data: {{ formatarData(pedido.data) }}</p>
        <p>Status: {{ formatarStatus(pedido.status) }}</p>

        <button
          v-if="pedido.status === 'iniciado' || pedido.status === 'em_processamento'"
          @click="cancelarPedido(pedido)"
          class="bg-red-500 text-white px-3 py-1 rounded mt-2"
        >
          ❌ Cancelar
        </button>
      </li>
    </ul>

    <p v-else>Nenhum pedido encontrado.</p>

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

// 📋 Carregar pedidos do cliente
async function carregarPedidos() {
  try {
    const { data } = await api.get('/pedidos', authHeaders())
    pedidos.value = data.pedidos || data
    console.log('📋 Pedidos carregados:', pedidos.value)
  } catch (err) {
    console.error('Erro ao carregar pedidos', err)
  }
}

// ❌ Cancelar pedido
async function cancelarPedido(pedido) {
  try {
    const { data } = await api.put(`/pedido/cancelar/${pedido._id}`, {}, authHeaders())
    pedido.status = 'cancelado'
    logs.value.push(`Pedido #${pedido._id} foi cancelado`)
    alert(data.mensagem)
  } catch (err) {
    console.error('Erro ao cancelar pedido', err)
    alert(err.response?.data?.mensagem || 'Erro ao cancelar pedido')
  }
}

function formatarData(data) {
  return new Date(data).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

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
