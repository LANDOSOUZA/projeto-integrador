<template>
  <div class="p-6">
    <h1>Produtos</h1>
    <ul>
      <li v-for="produto in produtos" :key="produto.id" style="margin-bottom: 1rem;">
        <strong>{{ produto.nome }}</strong> - R$ {{ produto.preco }}
        <button @click="adicionarAoCarrinho(produto)" style="margin-left: 1rem;">
          Comprar
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCarrinhoStore } from '../stores/carrinho'

const carrinho = useCarrinhoStore()

const produtos = ref([
  { id: 1, nome: 'Produto A', preco: 100 },
  { id: 2, nome: 'Produto B', preco: 150 },
  { id: 3, nome: 'Produto C', preco: 200 }
])

function adicionarAoCarrinho(produto) {
  carrinho.adicionar(produto)
  alert(`${produto.nome} adicionado ao carrinho!`)
}
</script>
