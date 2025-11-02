<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">🥤 Produtos</h1>

    <ul>
      <li
        v-for="produto in produtos"
        :key="produto._id"
        class="mb-4 border-b pb-4"
      >
        <strong>{{ produto.nome }}</strong>
        <span v-if="typeof produto.preco === 'number'">
          – R$ {{ produto.preco.toFixed(2) }}
        </span>
        <span v-else>
          – Preço não disponível
        </span>

        <p>{{ produto.descricao || 'Sem descrição.' }}</p>

        <button
          @click="adicionarAoCarrinho(produto)"
          :disabled="carrinho.totalQuantidade >= 3"
          class="mt-2 px-3 py-1 rounded text-white"
          :class="carrinho.totalQuantidade >= 3 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'"
        >
          {{ carrinho.totalQuantidade >= 3 ? 'Limite atingido' : 'Adicionar ao carrinho' }}
        </button>
      </li>
    </ul>

    <p v-if="carrinho.totalQuantidade >= 3" class="text-red-600 mt-4">
      ⚠️ Limite de 3 itens por pedido atingido.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCarrinhoStore } from '../stores/carrinho'
import { api } from '../services/api'

const carrinho = useCarrinhoStore()
const produtos = ref([])

onMounted(async () => {
  try {
    const { data } = await api.get('/produto')
    produtos.value = data.produtos
    console.log('📦 Produtos carregados:', produtos.value)
  } catch (err) {
    console.error('Erro ao carregar produtos', err)
  }
})

function adicionarAoCarrinho(produto) {
  if (carrinho.totalQuantidade < 3) {
    carrinho.adicionar(produto)
    console.log(`✅ ${produto.nome} adicionado ao carrinho`)
  }
}
</script>
