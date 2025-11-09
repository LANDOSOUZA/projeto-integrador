<script setup>
import { useRouter } from 'vue-router'
import { useCarrinhoStore } from '../stores/carrinho'
import { usePedidosStore } from '../stores/pedidos'
import { useUserStore } from '../stores/user'

const carrinho = useCarrinhoStore()

window.carrinho = carrinho

const pedidoStore = usePedidosStore()
const userStore = useUserStore()
const router = useRouter()

function aumentar(item) {
  carrinho.adicionar(item)
}

function diminuir(item) {
  carrinho.remover(item._id)
}


async function finalizarCompra() {
  try {
    if (!userStore.isAuthenticated) {
      alert('Você precisa estar logado para finalizar a compra.')
      router.push('/login')
      return
    }

    const itens = carrinho.itens.map(i => ({
      produtoId: i._id || i.id,   // garante que pega o id certo, seja _id (Mongo) ou id (numérico)
      quantidade: i.quantidade
    }))

    const total = itens.reduce((soma, i) => soma + i.quantidade, 0)
    if (total < 1 || total > 3) {
      alert('Você deve pedir entre 1 e 3 sucos por pedido.')
      return
    }

    const pedido = await pedidoStore.adicionarPedido(itens)

if (pedido) {
  // Mostra ID e status inicial do pedido
  alert(`Pedido criado com sucesso! ID: ${pedido._id} — Status: ${pedido.status}`)
  carrinho.limpar()
  router.push('/meus-pedidos')
} else {
  alert('Não foi possível criar o pedido')
}
} catch (err) {
  if (err.response) {
    console.error('Status:', err.response.status)
    console.error('Data:', err.response.data)
    alert(err.response.data.mensagem || 'Erro ao processar pedido')
  } else {
    console.error(err)
    alert('Erro inesperado ao finalizar pedido')
  }
}

}

</script>

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
