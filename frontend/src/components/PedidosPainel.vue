// frontend/src/components/PedidosPainel.vue
<script setup>
import { ref, onMounted } from 'vue'
import { usePedidosStore } from '../stores/pedidos'

const pedidoStore = usePedidosStore()
const logs = ref([])
const erro = ref('')

async function carregarPedidos() {
  try {
    await pedidoStore.listarTodosPedidosAdmin()
    logs.value.push(`Carregados ${pedidoStore.pedidos.length} pedidos`)
  } catch (err) {
    erro.value = 'Erro ao carregar pedidos'
  }
}

async function anteciparPedido(id) {
  try {
    const status = await pedidoStore.anteciparPedido(id)
    logs.value.push(`Pedido ${id} antecipado para "${status}"`)
    await carregarPedidos()
  } catch {
    logs.value.push(`Erro ao antecipar pedido ${id}`)
  }
}

async function cancelarPedido(id) {
  try {
    const status = await pedidoStore.cancelarPedido(id)
    logs.value.push(`Pedido ${id} cancelado — novo status: "${status}"`)
    await carregarPedidos()
  } catch {
    logs.value.push(`Erro ao cancelar pedido ${id}`)
  }
}

async function reporEstoque(pedido, item) {
  try {
    const produtoId = item.produtoId?._id   // 👈 pega o _id do item
    if (!produtoId) throw new Error('ProdutoId não encontrado no item')

    const response = await pedidoStore.reporEstoqueEPedido(pedido._id, produtoId)
    logs.value.push(response.message || 'Estoque reposto com sucesso')
    await carregarPedidos()
  } catch (err) {
    logs.value.push(`Erro ao repor estoque do pedido ${pedido._id}: ${err.message}`)
  }
}




async function finalizarCompra(itens) {
  logs.value.push('Finalizando compra...')
  try {
    const response = await pedidoStore.finalizarCompra(itens)
    logs.value.push(response.mensagem || 'Compra finalizada com sucesso!')
    await carregarPedidos()
  } catch (err) {
    logs.value.push(`Erro ao finalizar compra: ${err.message}`)
  }
}

async function excluirPedidosCliente(codigoCliente) {
  if (!confirm('Tem certeza que deseja excluir todos os pedidos deste cliente?')) return
  try {
    await pedidoStore.excluirPedidosClienteAdmin(codigoCliente)
    logs.value.push(`Pedidos do cliente ${codigoCliente} excluídos`)
    await carregarPedidos()
  } catch {
    logs.value.push(`Erro ao excluir pedidos do cliente ${codigoCliente}`)
  }
}

async function limparPedidos() {
  if (!confirm('Tem certeza que deseja limpar TODOS os pedidos?')) return
  try {
    await pedidoStore.limparPedidos()
    logs.value.push('Todos os pedidos foram removidos')
    await carregarPedidos()
  } catch {
    logs.value.push('Erro ao limpar pedidos')
  }
}

function getEmoji(nomeProduto) {
  const mapa = { laranja: '🍊', uva: '🍇', abacaxi: '🍍' }
  return mapa[nomeProduto] || '🥤'
}

onMounted(() => carregarPedidos())
</script>

<template>
  <div class="p-4 bg-white rounded shadow mt-6">
    <h2 class="text-xl font-bold text-[#005CA9] mb-4">🛒 Pedidos</h2>

    <div v-if="erro" class="text-red-600 mb-2">{{ erro }}</div>

    <table v-if="pedidoStore.pedidos.length" class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2 text-left">Cliente</th>
          <th class="p-2 text-left">Produtos</th>
          <th class="p-2 text-left">Status</th>
          <th class="p-2 text-left">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pedido in pedidoStore.pedidos" :key="pedido._id" class="border-b">
          <td class="p-2">{{ pedido.clienteId?.nome }}</td>
          <td class="p-2">
            <ul>
              <li v-for="item in pedido.itens" :key="item._id">
                {{ getEmoji(item.produtoId?.nome) }} {{ item.produtoId?.nome }} — {{ item.quantidade }}
                <button
                  v-if="pedido.status === 'processando'"
                  @click="reporEstoque(pedido, item)"
                  class="bg-green-600 text-white px-2 py-1 rounded ml-2"
                >
                  🔄 Repor Estoque
                </button>
              </li>
            </ul>
          </td>
          <!-- status do pedido -->
          <td class="p-2">{{ pedido.status }}</td>
          <!-- ações -->
          <td class="p-2 flex gap-2">
            <button @click="anteciparPedido(pedido._id)" class="bg-blue-500 text-white px-2 py-1 rounded">
              ⏩ Antecipar
            </button>
            <button @click="cancelarPedido(pedido._id)" class="bg-red-600 text-white px-2 py-1 rounded">
              🛑 Cancelar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="text-gray-600">Nenhum pedido encontrado.</div>

    <!-- Ações globais -->
    <div class="mt-4 flex gap-4">
      <button @click="limparPedidos" class="bg-black text-white px-4 py-2 rounded">
        🗑️ Limpar todos
      </button>
      <button @click="excluirPedidosCliente(prompt('Código do cliente'))" class="bg-gray-600 text-white px-4 py-2 rounded">
        🗑️ Excluir por cliente
      </button>
    </div>

    <!-- Logs -->
    <div class="mt-4 bg-gray-100 p-2 rounded text-sm">
      <h3 class="font-semibold mb-2">Logs:</h3>
      <ul>
        <li v-for="(log, i) in logs" :key="i">• {{ log }}</li>
      </ul>
    </div>
  </div>
</template>
