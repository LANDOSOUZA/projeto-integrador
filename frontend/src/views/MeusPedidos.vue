<template>
  <div class="p-6">
    <h1>📦 Meus Pedidos</h1>

    <ul>
      <li v-for="pedido in pedidos" :key="pedido._id" style="margin-bottom: 1rem;">
        <strong>Pedido #{{ pedido._id }}</strong>  
        <p>Laranja: {{ pedido.laranja }} | Uva: {{ pedido.uva }} | Abacaxi: {{ pedido.abacaxi }}</p>
        <p>Data: {{ new Date(pedido.data).toLocaleString() }}</p>
        <p>Status: {{ pedido.status }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const pedidos = ref([])

onMounted(async () => {
  try {
    const token = localStorage.getItem('token') // pega o token salvo no login
    const { data } = await axios.get('http://localhost:3000/pedidos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    pedidos.value = data
  } catch (err) {
    console.error('Erro ao carregar pedidos', err)
  }
})
</script>
