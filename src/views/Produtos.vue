<template>
  <div class="bg-[#F2F2F2] min-h-screen p-6">
    <h1 class="text-2xl font-bold mb-4 text-[#005CA9]">🥤 Produtos</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="produto in produtos"
        :key="produto._id"
        class="bg-white p-4 rounded shadow"
      >
        <strong class="text-lg text-[#005CA9]">{{ produto.nome }}</strong>
        <span v-if="typeof produto.preco === 'number'">
          – R$ {{ produto.preco.toFixed(2) }}
        </span>
        <p class="mt-2">{{ produto.descricao }}</p>
        <p><strong>Peso líquido:</strong> {{ produto.peso }}</p>
        <p v-if="produto.quantidade > 0">Disponível: {{ produto.quantidade }}</p>

        <button
          @click="adicionarAoCarrinho(produto)"
          :disabled="carrinho.totalQuantidade >= 3 || produto.status !== 'ativo'"
          class="mt-4 px-3 py-2 rounded text-white w-full"
          :class="carrinho.totalQuantidade >= 3 || produto.status !== 'ativo'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#005CA9] hover:bg-[#0074C7]'"
        >
          {{ carrinho.totalQuantidade >= 3
            ? 'Limite atingido'
            : produto.status !== 'ativo'
              ? 'Indisponível'
              : 'Adicionar ao carrinho' }}
        </button>
      </div>
    </div>
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
    // Filtra apenas produtos ativos
    produtos.value = (data.produtos || []).filter(p => p.status === 'ativo')
    console.log('📦 Produtos carregados:', produtos.value)
  } catch (err) {
    console.error('Erro ao carregar produtos', err)
  }
})

function adicionarAoCarrinho(produto) {
  if (carrinho.totalQuantidade < 3 && produto.status === 'ativo') {
    carrinho.adicionar({
      id: produto.id,          // 👈 garante que o id fixo (1, 2, 3) vai junto
      nome: produto.nome,
      preco: produto.preco,
      quantidade: 1
    })
    console.log(`✅ ${produto.nome} adicionado ao carrinho`)
  }
}

</script>
