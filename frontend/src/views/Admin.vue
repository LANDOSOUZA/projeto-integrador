<script setup>
import { onMounted, ref } from 'vue'
import { usePedidosStore } from '../stores/pedidos'

const pedidoStore = usePedidosStore()
const logs = ref([])
const erro = ref('')

// 📋 Carregar pedidos
async function carregarPedidos() {
  try {
    await pedidoStore.listarTodosPedidosAdmin()
    logs.value.push(`Carregados ${pedidoStore.pedidos.length} pedidos`)
  } catch (err) {
    erro.value = 'Erro ao carregar pedidos'
  }
}

// ⏩ Antecipar pedido
async function anteciparPedido(id) {
  try {
    const status = await pedidoStore.anteciparPedido(id)
    logs.value.push(`Pedido ${id} antecipado para "${status}"`)
    carregarPedidos()
  } catch {
    logs.value.push(`Erro ao antecipar pedido ${id}`)
  }
}

// 🗑️ Excluir pedidos de cliente
async function excluirPedidosCliente(codigoCliente) {
  if (!confirm('Tem certeza que deseja excluir todos os pedidos deste cliente?')) return
  try {
    await pedidoStore.excluirPedidosClienteAdmin(codigoCliente)
    logs.value.push(`Pedidos do cliente ${codigoCliente} excluídos`)
    carregarPedidos()
  } catch {
    logs.value.push(`Erro ao excluir pedidos do cliente ${codigoCliente}`)
  }
}

// 🧹 Limpar todos os pedidos
async function limparPedidos() {
  if (!confirm('Tem certeza que deseja limpar TODOS os pedidos?')) return
  try {
    await pedidoStore.limparPedidos()
    logs.value.push('Todos os pedidos foram removidos')
    carregarPedidos()
  } catch {
    logs.value.push('Erro ao limpar pedidos')
  }
}

// 🍹 Emoji para produtos
function getEmoji(nomeProduto) {
  const mapa = { laranja: '🍊', uva: '🍇', abacaxi: '🍍' }
  return mapa[nomeProduto] || '🥤'
}

onMounted(() => {
  carregarPedidos()
})
</script>

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
        <tr v-for="pedido in pedidoStore.pedidos" :key="pedido._id" class="border-b">
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
