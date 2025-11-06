<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Painel Administrativo</h1>

    <div class="mb-4 flex gap-2">
      <button @click="carregarPedidos" class="bg-blue-500 text-white px-4 py-2 rounded">
        🔄 Atualizar
      </button>
      <button @click="limparPedidos" class="bg-red-600 text-white px-4 py-2 rounded">
        🧹 Limpar todos os pedidos
      </button>
    </div>

    <table class="w-full border">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2 border">Cliente</th>
          <th class="p-2 border">Código</th>
          <th class="p-2 border">Sabores</th>
          <th class="p-2 border">Status</th>
          <th class="p-2 border">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pedido in pedidos" :key="pedido._id" class="border-b">
          <td class="p-2 border">{{ pedido.clienteId?.nome }}</td>
          <td class="p-2 border">{{ pedido.codigoCliente }}</td>
          <td class="p-2 border">
            <span v-for="item in pedido.itens" :key="item._id" class="mr-2">
              {{ getEmoji(item.produtoId?.nome) }} {{ item.quantidade }}
            </span>
          </td>
          <td class="p-2 border">{{ pedido.status }}</td>
          <td class="p-2 border flex gap-2">
            <button
              @click="anteciparPedido(pedido._id)"
              class="bg-green-500 text-white px-2 py-1 rounded"
              :disabled="pedido.status === 'cancelado' || pedido.status === 'pronto'"
            >
              ⏩ Antecipar
            </button>
            <button
              @click="excluirPedidosCliente(pedido.codigoCliente)"
              class="bg-red-500 text-white px-2 py-1 rounded"
            >
              🗑️ Excluir cliente
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-2">📜 Logs</h2>
      <ul class="list-disc pl-6">
        <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
      </ul>
    </div>

    <p v-if="erro" class="text-red-600 mt-4">{{ erro }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../services/api'
import { useUserStore } from '../stores/user'

const pedidos = ref([])
const logs = ref([])
const erro = ref('')
const userStore = useUserStore()

function authHeaders() {
  return {
    headers: { Authorization: `Bearer ${userStore.token}` }
  }
}

async function carregarPedidos() {
  try {
    const { data } = await api.get('/pedido/admin', authHeaders())
    pedidos.value = data.pedidos
    logs.value.push(`Carregados ${data.pedidos.length} pedidos`)
  } catch (err) {
    erro.value = err.response?.data?.mensagem || 'Erro ao carregar pedidos'
  }
}

async function anteciparPedido(id) {
  try {
    const { data } = await api.put(`/pedido/admin/antecipar/${id}`, {}, authHeaders())
    logs.value.push(`Pedido ${id} antecipado para "${data.pedido.status}"`)
    carregarPedidos()
  } catch (err) {
    logs.value.push(`Erro ao antecipar pedido ${id}`)
  }
}

async function excluirPedidosCliente(codigoCliente) {
  if (!confirm('Tem certeza que deseja excluir todos os pedidos deste cliente?')) return
  try {
    await api.delete(`/pedido/admin/excluir/${codigoCliente}`, authHeaders())
    logs.value.push(`Pedidos do cliente ${codigoCliente} excluídos`)
    carregarPedidos()
  } catch (err) {
    logs.value.push(`Erro ao excluir pedidos do cliente ${codigoCliente}`)
  }
}

async function limparPedidos() {
  if (!confirm('Tem certeza que deseja limpar TODOS os pedidos?')) return
  try {
    await api.delete('/pedido/admin/limpar', authHeaders())
    logs.value.push('Todos os pedidos foram removidos')
    carregarPedidos()
  } catch (err) {
    logs.value.push('Erro ao limpar pedidos')
  }
}

function getEmoji(nomeProduto) {
  const mapa = {
    laranja: '🍊',
    uva: '🍇',
    abacaxi: '🍍'
  }
  return mapa[nomeProduto] || '🥤'
}

onMounted(() => {
  carregarPedidos()
})
</script>
