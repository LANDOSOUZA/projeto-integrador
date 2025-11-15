<script setup>
import { ref, onMounted } from 'vue'
import { useProdutoStore } from '../stores/produto'

const produtoStore = useProdutoStore()
const erro = ref('')
const logs = ref([])

async function carregarProdutos() {
  try {
    await produtoStore.listarProdutos()
    logs.value.push(`Carregados ${produtoStore.produtos.length} produtos`)
  } catch (err) {
    erro.value = 'Erro ao carregar produtos'
  }
}

async function ativarProduto(id) {
  try {
    await produtoStore.atualizarStatusProduto(id, 'ativo')
    logs.value.push(`Produto ${id} ativado`)
    await carregarProdutos()
  } catch {
    logs.value.push(`Erro ao ativar produto ${id}`)
  }
}

async function desativarProduto(id) {
  try {
    await produtoStore.atualizarStatusProduto(id, 'inativo')
    logs.value.push(`Produto ${id} desativado`)
    await carregarProdutos()
  } catch {
    logs.value.push(`Erro ao desativar produto ${id}`)
  }
}

function getEmoji(nome) {
  const mapa = { laranja: '🍊', uva: '🍇', abacaxi: '🍍' }
  return mapa[nome] || '🥤'
}

onMounted(() => carregarProdutos())
</script>

<template>
  <div class="p-4 bg-white rounded shadow mt-4">
    <h2 class="text-xl font-bold text-[#005CA9] mb-4">📦 Produtos</h2>

    <div v-if="erro" class="text-red-600 mb-2">{{ erro }}</div>

    <table v-if="produtoStore.produtos.length" class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2 text-left">Produto</th>
          <th class="p-2 text-left">Status</th>
          <th class="p-2 text-left">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="produto in produtoStore.produtosOrdenados" :key="produto._id" class="border-b">
          <td class="p-2">{{ getEmoji(produto.nome) }} {{ produto.nome }}</td>
          <td class="p-2">
            <span
              class="px-2 py-1 rounded text-sm"
              :class="{
                'bg-green-100 text-green-800': produto.status === 'ativo',
                'bg-red-100 text-red-800': produto.status === 'inativo'
              }"
            >
              {{ produto.status }}
            </span>
          </td>
          <td class="p-2 flex gap-2">
            <button
              v-if="produto.status !== 'ativo'"
              @click="ativarProduto(produto._id)"
              class="bg-green-600 text-white px-2 py-1 rounded"
            >
              ✅ Ativar
            </button>
            <button
              v-else
              @click="desativarProduto(produto._id)"
              class="bg-red-600 text-white px-2 py-1 rounded"
            >
              🛑 Desativar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="text-gray-600">Nenhum produto encontrado.</div>

    <!-- Logs -->
    <div class="mt-4 bg-gray-100 p-2 rounded text-sm">
      <h3 class="font-semibold mb-2">Logs:</h3>
      <ul>
        <li v-for="(log, i) in logs" :key="i">• {{ log }}</li>
      </ul>
    </div>
  </div>
</template>
