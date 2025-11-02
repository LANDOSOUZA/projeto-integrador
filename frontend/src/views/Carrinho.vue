<template>
  <div class="carrinho p-6">
    <h2 class="text-2xl font-bold mb-4">🛒 Seu Carrinho</h2>

    <ul v-if="carrinhoStore.itens.length">
      <li v-for="item in carrinhoStore.itens" :key="item.id" class="item-carrinho">
        <div class="controle">
          <!-- Se quantidade = 1, mostra lixeira; senão, mostra "-" -->
          <button @click="diminuir(item)">
            <span v-if="item.quantidade === 1">🗑️</span>
            <span v-else>-</span>
          </button>

          <span class="quantidade">{{ item.quantidade }}</span>

          <!-- Botão + desabilitado se já houver 3 no total -->
          <button 
            @click="aumentar(item)" 
            :disabled="carrinhoStore.totalQuantidade >= 3"
          >
            +
          </button>
        </div>

        <span class="nome">{{ item.nome }}</span>
        <span class="preco">R$ {{ (item.preco * item.quantidade).toFixed(2) }}</span>
      </li>
    </ul>

    <p v-else>Seu carrinho está vazio.</p>

    <p class="mt-4 font-semibold">Total: R$ {{ carrinhoStore.total.toFixed(2) }}</p>

    <button 
      @click="finalizarCompra" 
      :disabled="carrinhoStore.totalQuantidade < 1"
      class="bg-green-600 text-white px-4 py-2 rounded mt-4"
    >
      Finalizar compra
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCarrinhoStore } from '../stores/carrinho'
import { api } from '../services/api'

const carrinhoStore = useCarrinhoStore()
const router = useRouter()

function aumentar(item) {
  carrinhoStore.adicionar(item)
}

function diminuir(item) {
  carrinhoStore.remover(item.id)
}

async function finalizarCompra() {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Você precisa estar logado para finalizar a compra.')
      return
    }

    const pedido = {
      laranja: carrinhoStore.itens.find(i => i.nome === 'laranja')?.quantidade || 0,
      uva: carrinhoStore.itens.find(i => i.nome === 'uva')?.quantidade || 0,
      abacaxi: carrinhoStore.itens.find(i => i.nome === 'abacaxi')?.quantidade || 0
    }

    const total = pedido.laranja + pedido.uva + pedido.abacaxi
    if (total < 1 || total > 3) {
      alert('Você deve pedir entre 1 e 3 sucos por pedido.')
      return
    }

    const { data } = await api.post('/pedido', pedido, {
      headers: { Authorization: `Bearer ${token}` }
    })

    console.log('🧃 Pedido criado:', data.pedido)
    alert(`Pedido #${data.pedido._id} criado com sucesso!`)

    carrinhoStore.limpar()
    router.push('/meus-pedidos') // redireciona para histórico
  } catch (err) {
    console.error('Erro ao finalizar pedido:', err)
    alert(err.response?.data?.mensagem || 'Erro ao finalizar pedido')
  }
}
</script>

<style scoped>
.item-carrinho {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  justify-content: space-between;
}

.controle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.controle button {
  width: 32px;
  height: 32px;
  font-size: 18px;
  text-align: center;
}

.quantidade {
  min-width: 20px;
  text-align: center;
}
</style>
