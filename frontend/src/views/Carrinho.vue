<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">🛒 Meu Carrinho</h1>

    <ul v-if="carrinho.itens.length > 0">
      <li v-for="(item, index) in carrinho.itens" :key="index">
        {{ item.nome }} – {{ item.quantidade }}
        <button @click="aumentar(item)">+</button>
        <button @click="diminuir(item)">-</button>
      </li>
    </ul>

    <p v-else>
      Seu carrinho está vazio.
    </p>

    <button
      v-if="carrinho.itens.length > 0"
      @click="finalizarCompra"
      class="mt-4 px-4 py-2 bg-green-600 text-white rounded"
    >
      Finalizar Compra
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCarrinhoStore } from '../stores/carrinho'
import { api } from '../services/api'

const carrinho = useCarrinhoStore()
const router = useRouter()

function aumentar(item) {
  carrinho.adicionar(item)
}

function diminuir(item) {
  carrinho.remover(item.id)
}

async function finalizarCompra() {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Você precisa estar logado para finalizar a compra.')
      router.push('/login')
      return
    }

    const itens = carrinho.itens.map(i => ({
      produtoId: i.id,
      quantidade: i.quantidade
    }))
    console.log('🛒 Itens enviados:', JSON.stringify(itens, null, 2))


    const total = itens.reduce((soma, i) => soma + i.quantidade, 0)
    if (total < 1 || total > 3) {
      alert('Você deve pedir entre 1 e 3 sucos por pedido.')
      return
    }

    console.log('🛒 Itens enviados:', itens)


    const { data } = await api.post('/pedido', { itens }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    console.log('🧃 Pedido criado:', data.pedido)
    alert(`Pedido #${data.pedido.codigoCliente} criado com sucesso!`)

    carrinho.limpar()
    router.push('/meus-pedidos')
  } catch (err) {
    console.error('Erro ao finalizar pedido:', err)
    alert(err.response?.data?.mensagem || 'Erro ao finalizar pedido')
  }
}
</script>
