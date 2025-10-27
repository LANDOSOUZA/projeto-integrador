<template>
  <div class="p-6">
    <h1>Carrinho</h1>

    <!-- Caso não tenha itens -->
    <div v-if="carrinho.itens.length === 0">
      <p>Seu carrinho está vazio.</p>
    </div>

    <!-- Lista de itens -->
    <ul v-else>
      <li
        v-for="(item, index) in carrinho.itens"
        :key="index"
        style="margin-bottom: 1rem;"
      >
        {{ item.nome }} - R$ {{ item.preco }}
      </li>
    </ul>

    <!-- Total e ações -->
    <div v-if="carrinho.itens.length > 0" style="margin-top: 1rem;">
      <strong>Total: R$ {{ total }}</strong>
      <br />
      <button @click="finalizarCompra" style="margin-top: 0.5rem;">
        Finalizar Compra
      </button>
      <button @click="carrinho.limpar()" style="margin-left: 1rem;">
        Limpar Carrinho
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCarrinhoStore } from '../stores/carrinho'
import { usePedidosStore } from '../stores/pedidos'

const carrinho = useCarrinhoStore()
const pedidosStore = usePedidosStore()

const total = computed(() =>
  carrinho.itens.reduce((soma, item) => soma + item.preco, 0)
)

function finalizarCompra() {
  if (carrinho.itens.length === 0) return
  pedidosStore.adicionarPedido([...carrinho.itens]) // salva no histórico
  alert('Compra finalizada! Pedido registrado.')
  carrinho.limpar()
}
</script>
