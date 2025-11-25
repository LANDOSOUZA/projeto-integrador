<script setup>
import { useCarrinhoStore } from '../stores/carrinho'
import { usePedidosStore } from '../stores/pedidos'

const carrinho = useCarrinhoStore()
const pedidoStore = usePedidosStore()

function aumentar(item) {
  if (carrinho.totalQuantidade < 3) {
    // passa o objeto no formato esperado pelo store
    carrinho.adicionar({
      _id: item.produtoId,   // store compara com produto._id
      nome: item.nome,
      preco: item.preco
    })
  }
}

function diminuir(item) {
  carrinho.remover(item.produtoId)
}

function removerItem(produtoId) {
  carrinho.remover(produtoId)
}

async function finalizarCompra() {
  if (carrinho.totalQuantidade === 0) {
    alert('⚠️ Seu carrinho está vazio.')
    return
  }
  try {
    const response = await pedidoStore.finalizarCompra(
      carrinho.itens.map(i => ({
        produtoId: i.produtoId,
        quantidade: i.quantidade
      }))
    )
    alert(response.mensagem || '✅ Pedido finalizado com sucesso!')
    carrinho.limpar()
  } catch (err) {
    alert(err.response?.data?.message || 'Erro ao finalizar pedido')
  }
}
</script>

<template>
  <div class="bg-[#F2F2F2] min-h-screen p-6">
    <h1 class="text-2xl font-bold mb-4 text-[#005CA9]">Meu Carrinho</h1>

    <div v-if="carrinho.itens.length === 0" class="text-gray-500">
      Seu carrinho está vazio.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="item in carrinho.itens"
        :key="item.produtoId"
        class="bg-white p-4 rounded shadow flex justify-between items-center"
      >
        <div>
          <strong class="text-lg text-[#005CA9]">{{ item.nome }}</strong>
          <p>Preço: R$ {{ item.preco.toFixed(2) }}</p>
        </div>

        <div class="flex items-center gap-2">
          <button @click="diminuir(item)" class="px-3 py-1 bg-gray-200 rounded">−</button>
          <span class="px-4 py-1 border rounded bg-gray-100 font-semibold">
            {{ item.quantidade }}
          </span>
          <button 
            @click="aumentar(item)" 
            :disabled="carrinho.totalQuantidade >= 3"
            class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >+</button>
          <button 
            @click="removerItem(item.produtoId)" 
            class="px-3 py-1 bg-red-500 text-white rounded"
          >
            🗑️
          </button>

          <!-- Mostrar preço unitário -->
          <span class="ml-4 text-gray-700">
            R$ {{ item.precoUnitario }}
          </span>

          <!-- Mostrar subtotal -->
          <span class="ml-4 font-bold text-green-600">
            Subtotal: R$ {{ item.subtotal }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="carrinho.itens.length > 0" class="mt-6 text-right space-y-2">
      <p class="text-lg font-semibold">
        Total de itens: {{ carrinho.totalQuantidade }} / 3
      </p>
      <p class="text-lg font-bold text-[#005CA9]">
        Valor total: R$ {{ carrinho.total.toFixed(2) }}
      </p>

      <p class="mt-4 text-xl font-bold">
        Total do pedido: R$ {{ pedido.total }}      </p>


      <div class="flex justify-end gap-2">
        <button 
          @click="carrinho.limpar()" 
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition font-semibold"
        >
          🗑️ Esvaziar Carrinho
        </button>

        <button 
          @click="finalizarCompra"
          class="px-4 py-2 bg-[#005CA9] text-white rounded hover:bg-[#0074C7] transition font-semibold"
        >
          ✅ Finalizar Compra
        </button>
      </div>
    </div>
  </div>
</template>
