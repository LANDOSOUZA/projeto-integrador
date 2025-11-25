<script setup>
import { usePedidosStore } from '../stores/pedidos'   // plural
const pedidoStore = usePedidosStore()

const emit = defineEmits(['reporEstoque', 'anteciparPedido', 'cancelarPedido'])
</script>


<template>
  <div class="p-4 bg-white rounded shadow mt-6">
    <h2 class="text-xl font-bold text-[#005CA9] mb-4">🛒 Pedidos</h2>

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
                {{ item.produtoId?.nome }} — {{ item.quantidade }}
                <button
                  v-if="pedido.status === 'processando'"
                  @click="$emit('reporEstoque', pedido, item)"
                  class="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded ml-2"
                >
                  🔄 Repor Estoque
                </button>
              </li>
            </ul>
          </td>
          <!-- Badge colorida para status -->
          <td class="p-2">
            <span
              :class="{
                'bg-orange-200 text-orange-800 px-2 py-1 rounded': pedido.status === 'processando',
                'bg-green-200 text-green-800 px-2 py-1 rounded': pedido.status === 'em_processamento'
              }"
            >
              {{ pedido.status }}
            </span>
          </td>
          <!-- ações -->
          <td class="p-2 flex gap-2">
            <button
              @click="$emit('anteciparPedido', pedido._id)"
              class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
            >
              ⏩ Antecipar
            </button>
            <button
              @click="$emit('cancelarPedido', pedido._id)"
              class="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
            >
              🛑 Cancelar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="text-gray-600">Nenhum pedido encontrado.</div>
  </div>
</template>
