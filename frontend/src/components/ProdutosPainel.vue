<script setup>
import { ref, onMounted } from 'vue'
import { usePedidosStore } from '../stores/pedidos'

const pedidoStore = usePedidosStore()
const carrinho = ref([])
const logs = ref([])
const carregandoFinalizar = ref(false)

function adicionarAoCarrinho(produto) {
  carrinho.value.push({ produtoId: produto._id, quantidade: 1 })
  logs.value.push(`Produto ${produto.nome} adicionado ao carrinho`)
}

async function finalizarCompra() {
  carregandoFinalizar.value = true
  logs.value.push('Finalizando compra...')
  try {
    const response = await pedidoStore.finalizarCompra(carrinho.value)
    logs.value.push(response.mensagem || 'Compra finalizada com sucesso!')
    carrinho.value = [] // limpa carrinho após compra
  } catch (err) {
    logs.value.push(`Erro ao finalizar compra: ${err.message}`)
  } finally {
    carregandoFinalizar.value = false
  }
}

onMounted(async () => {
  // se houver rota de produtos, carregue aqui
  await pedidoStore.listarProdutos()
})
</script>

<template>
  <div class="p-4 bg-white rounded shadow mt-6">
    <h2 class="text-xl font-bold text-[#005CA9] mb-4">🛍️ Produtos</h2>

    <!-- Lista de produtos -->
    <div v-for="produto in pedidoStore.produtos" :key="produto._id" class="border-b p-2 flex justify-between">
      <span>{{ produto.nome }} — R$ {{ produto.preco }}</span>
      <button @click="adicionarAoCarrinho(produto)" class="bg-blue-500 text-white px-2 py-1 rounded">
        ➕ Adicionar
      </button>
    </div>

    <!-- Carrinho -->
    <div class="mt-4">
      <h3 class="font-semibold">Carrinho:</h3>
      <ul>
        <li v-for="(item, i) in carrinho" :key="i">
          {{ item.produtoId }} — {{ item.quantidade }}
        </li>
      </ul>
    </div>

    <!-- Botão Finalizar compra -->
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
      <h3 class="font-semibold mb-2">Logs:</h3>
      <ul>
        <li v-for="(log, i) in logs" :key="i">• {{ log }}</li>
      </ul>
    </div>
  </div>
</template>

