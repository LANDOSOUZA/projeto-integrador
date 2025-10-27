<template>
  <div class="p-6">
    <h1>Produtos</h1>
    <ul>
      <li v-for="produto in produtos" :key="produto._id" style="margin-bottom: 1rem;">
        <strong>{{ produto.nome }}</strong> - R$ {{ produto.preco }}
        <button @click="adicionarAoCarrinho(produto)" style="margin-left: 1rem;">
          Comprar
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useCarrinhoStore } from '../stores/carrinho'

const carrinho = useCarrinhoStore()
const produtos = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/produtos')
    produtos.value = data
  } catch (err) {
    console.error('Erro ao carregar produtos', err)
  }
})

function adicionarAoCarrinho(produto) {
  carrinho.adicionar(produto)
  alert(`${produto.nome} adicionado ao carrinho!`)
}
</script>

