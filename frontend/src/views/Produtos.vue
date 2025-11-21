<script setup>
import { onMounted } from 'vue'
import { useCarrinhoStore } from '../stores/carrinho'
import { useProdutoStore } from '../stores/produto'
import { useRouter } from 'vue-router'

const carrinho = useCarrinhoStore()
const produtoStore = useProdutoStore()
const router = useRouter()

onMounted(async () => {
  await produtoStore.listarProdutos()
})

function adicionarAoCarrinho(produto) {
  if (carrinho.totalQuantidade < 3 && produto.status === 'ativo') {
    carrinho.adicionar({
      _id: produto._id,   // usa o id do backend
      nome: produto.nome,
      preco: produto.preco,
      quantidade: 1
    })
    console.log(`✅ ${produto.nome} adicionado ao carrinho`)
  }
}

</script>

<template>
  <div class="bg-[#F2F2F2] min-h-screen p-6">
    <h1 class="text-2xl font-bold mb-4 text-[#005CA9]">🥤 Produtos</h1>

    <!-- Feedback de carregamento -->
    <div v-if="produtoStore.loading" class="text-gray-500 mb-4">
      Carregando produtos...
    </div>

    <!-- Feedback de erro -->
    <div v-if="produtoStore.error" class="text-red-500 mb-4">
      Erro: {{ produtoStore.error.message || produtoStore.error }}
    </div>

    <!-- Mensagem quando não há produtos -->
    <div v-if="!produtoStore.loading && produtoStore.produtos.length === 0" class="text-gray-500 mb-4">
      Nenhum produto disponível no momento.
    </div>

    <!-- Lista de produtos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="produto in produtoStore.produtos"
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
          :class="carrinho.totalQuantidade >= 3
            ? 'bg-green-600 hover:bg-green-700 cursor-not-allowed'
            : produto.status !== 'ativo'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#005CA9] hover:bg-[#0074C7]'"
        >
          {{ carrinho.totalQuantidade >= 3
            ? 'Produto selecionado'
            : produto.status !== 'ativo'
              ? 'Indisponível'
              : 'Adicionar ao carrinho' }}
        </button>

      </div>

          <!-- Lista de produtos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="produto in produtoStore.produtos"
        :key="produto._id"
        class="bg-white p-4 rounded shadow"
      >
        <!-- conteúdo do card -->
      </div>
    </div>

    <!-- Botão fixo no rodapé -->
    <div class="fixed bottom-4 left-0 right-0 flex justify-center">
      <button 
        v-if="carrinho.totalQuantidade > 0" 
        @click="$router.push('/carrinho')"
        class="px-6 py-3 bg-[#FF9800] text-white rounded-lg shadow-lg hover:bg-[#F57C00] transition font-bold animate-bounce"
      >
        🛒 Ir para o Carrinho
      </button>

      <button 
        v-else
        @click="$router.push('/login')"
        class="px-6 py-3 bg-[#005CA9] text-white rounded-lg shadow-lg hover:bg-[#0074C7] transition font-bold animate-bounce"
      >
        🔑 Entrar para acessar o Carrinho
      </button>
    </div>

    </div>
  </div>
</template>
