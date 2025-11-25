<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePedidosStore } from '../stores/pedidos'
import { useProdutoStore } from '../stores/produto'

const pedidoStore = usePedidosStore()
const produtoStore = useProdutoStore()

const carrinho = ref([])
const logs = ref([])
const carregandoFinalizar = ref(false)

function adicionarAoCarrinho(produto) {
  const itemExistente = carrinho.value.find(i => i.produtoId === produto._id)
  if (itemExistente) {
    itemExistente.quantidade += 1
  } else {
    carrinho.value.push({
      produtoId: produto._id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: 1
    })
  }
}

function incrementarQuantidade(produtoId) {
  const item = carrinho.value.find(i => i.produtoId === produtoId)
  if (item) {
    item.quantidade += 1
  }
}

function removerDoCarrinho(produtoId) {
  const idx = carrinho.value.findIndex(i => i.produtoId === produtoId)
  if (idx >= 0) {
    if (carrinho.value[idx].quantidade > 1) {
      carrinho.value[idx].quantidade -= 1
    } else {
      carrinho.value.splice(idx, 1)
    }
  }
}

const total = computed(() =>
  carrinho.value.reduce((acc, i) => acc + (i.preco * i.quantidade), 0)
)

async function finalizarCompra() {
  carregandoFinalizar.value = true
  logs.value.push('Finalizando compra...')
  try {
    const payload = carrinho.value.map(i => ({ produtoId: i.produtoId, quantidade: i.quantidade }))
    const response = await pedidoStore.finalizarCompra(payload)
    logs.value.push(response?.mensagem || 'Compra finalizada com sucesso!')
    carrinho.value = []
  } catch (err) {
    logs.value.push(`Erro ao finalizar: ${err.message}`)
  } finally {
    carregandoFinalizar.value = false
  }
}

onMounted(() => {
  produtoStore.listarProdutos()
})
</script>

<template>
  <div class="p-4 bg-white rounded shadow mt-6">
    <h2 class="text-xl font-bold text-[#005CA9] mb-4">🛍️ Produtos</h2>

    <!-- Lista de produtos -->
    <div v-for="produto in produtoStore.produtos" :key="produto._id" class="border-b p-2 flex justify-between">
      <span>{{ produto.nome }} — R$ {{ produto.preco }}</span>
      <button @click="adicionarAoCarrinho(produto)" class="bg-blue-500 text-white px-2 py-1 rounded">
        ➕ Adicionar
      </button>
    </div>

    <!-- Carrinho -->
    <div class="mt-4">
      <h3 class="font-semibold">Carrinho</h3>
      <ul>
        <li v-for="item in carrinho" :key="item.produtoId" class="flex items-center gap-3">
          <span>{{ item.nome }} — {{ item.quantidade }}x — R$ {{ item.preco }}</span>
          <button @click="incrementarQuantidade(item.produtoId)" class="bg-blue-500 text-white px-2 rounded">+</button>
          <button @click="removerDoCarrinho(item.produtoId)" class="bg-gray-300 text-black px-2 rounded">-</button>
        </li>
      </ul>
      <div class="mt-2 font-semibold">Total: R$ {{ total }}</div>
    </div>

    <!-- Botão Finalizar -->
    <button
      @click="finalizarCompra"
      class="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center mt-4"
      :disabled="carregandoFinalizar"
    >
      <span v-if="!carregandoFinalizar">Finalizar compra</span>
      <span v-else class="flex items-center gap-2">
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
        </svg>
        Processando...
      </span>
    </button>

    <!-- Logs -->
    <div class="mt-4 bg-gray-100 p-2 rounded text-sm">
      <h3 class="font-semibold mb-2">Logs</h3>
      <ul>
        <li v-for="(log, i) in logs" :key="i">• {{ log }}</li>
      </ul>
    </div>
  </div>
</template>
