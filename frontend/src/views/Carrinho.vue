<script setup>
import { useCarrinhoStore } from '../stores/carrinho'

const carrinho = useCarrinhoStore()

function aumentar(item) {
  if (carrinho.totalQuantidade < 3) {
    carrinho.adicionar({ ...item, quantidade: 1 })
  }
}

function diminuir(item) {
  if (item.quantidade > 1) {
    item.quantidade -= 1
  } else {
    carrinho.remover(item.id)
  }
}

function removerItem(id) {
  carrinho.remover(id)
}

async function finalizarCompra() {
  try {
    // Aqui você chamaria o backend para criar o pedido
    await carrinho.finalizarPedido()
    alert('✅ Pedido finalizado com sucesso!')
  } catch (err) {
    alert(err.response?.data?.message || 'Erro ao finalizar pedido')
  }
}
</script>

<template>
  <div class="bg-[#F2F2F2] min-h-screen p-6">
    <h1 class="text-2xl font-bold mb-4 text-[#005CA9]">🛒 Meu Carrinho</h1>

    <!-- Mensagem quando carrinho está vazio -->
    <div v-if="carrinho.itens.length === 0" class="text-gray-500">
      Seu carrinho está vazio.
    </div>

    <!-- Lista de itens -->
    <div v-else class="space-y-4">
      <div
        v-for="item in carrinho.itens"
        :key="item.id"
        class="bg-white p-4 rounded shadow flex justify-between items-center"
      >
        <!-- Info do produto -->
        <div>
          <strong class="text-lg text-[#005CA9]">{{ item.nome }}</strong>
          <p>Preço: R$ {{ item.preco.toFixed(2) }}</p>
        </div>

        <!-- Controles de quantidade -->
        <div class="flex items-center gap-2">
          <!-- Botão diminuir -->
          <button
            @click="diminuir(item)"
            class="px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
          >
            -
          </button>

          <!-- Quantidade -->
          <span class="px-4 py-1 border rounded bg-gray-100 font-semibold">
            {{ item.quantidade }}
          </span>

          <!-- Botão aumentar -->
          <button
            @click="aumentar(item)"
            :disabled="carrinho.totalQuantidade >= 3"
            class="px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300 transition disabled:opacity-50"
          >
            +
          </button>

          <!-- Botão remover -->
          <button
            @click="removerItem(item.id)"
            class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            title="Remover item"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- Total + Finalizar -->
    <div v-if="carrinho.itens.length > 0" class="mt-6 text-right space-y-2">
      <p class="text-lg font-semibold">
        Total de itens: {{ carrinho.totalQuantidade }} / 3
      </p>
      <p class="text-lg font-bold text-[#005CA9]">
        Valor total: R$ {{
          carrinho.itens.reduce((acc, p) => acc + p.preco * p.quantidade, 0).toFixed(2)
        }}
      </p>

      <!-- Botão Finalizar Compra -->
      <button
        @click="finalizarCompra"
        class="px-4 py-2 bg-[#005CA9] text-white rounded hover:bg-[#0074C7] transition font-semibold"
      >
        ✅ Finalizar Compra
      </button>
    </div>
  </div>
</template>
