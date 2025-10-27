<template>
  <div class="p-6">
    <h1>🛒 Meu Carrinho</h1>

    <div>
      <p>Laranja: {{ carrinho.laranja }}</p>
      <button @click="carrinho.laranja++">+</button>
      <button @click="carrinho.laranja--" :disabled="carrinho.laranja <= 0">-</button>
    </div>

    <div>
      <p>Uva: {{ carrinho.uva }}</p>
      <button @click="carrinho.uva++">+</button>
      <button @click="carrinho.uva--" :disabled="carrinho.uva <= 0">-</button>
    </div>

    <div>
      <p>Abacaxi: {{ carrinho.abacaxi }}</p>
      <button @click="carrinho.abacaxi++">+</button>
      <button @click="carrinho.abacaxi--" :disabled="carrinho.abacaxi <= 0">-</button>
    </div>

    <button @click="finalizarCompra" style="margin-top:1rem;">
      Finalizar compra
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const carrinho = ref({ laranja: 0, uva: 0, abacaxi: 0 })

async function finalizarCompra() {
  try {
    const token = localStorage.getItem('token') // 🔹 pega o token salvo no login
    const { data } = await axios.post(
      'http://localhost:3000/pedidos',
      { ...carrinho.value }, // 🔹 não precisa mais de clienteId
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    alert(`Pedido #${data._id} criado com sucesso!`)
    carrinho.value = { laranja: 0, uva: 0, abacaxi: 0 }
  } catch (err) {
    alert(err.response?.data?.erro || 'Erro ao finalizar compra')
    console.error(err)
  }
}
</script>

