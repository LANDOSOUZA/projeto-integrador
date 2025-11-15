<script setup>
import PedidosPainel from '../components/PedidosPainel.vue'
import ProdutosPainel from '../components/ProdutosPainel.vue'
import UsuariosPainel from '../components/UsuariosPainel.vue'
import axios from 'axios'

// --- 🔌 Controle CLP ---
async function iniciarProducao() {
  try {
    await axios.post('/clp/iniciar')
    alert('🚀 Produção iniciada!')
  } catch (err) {
    alert('❌ Erro ao iniciar produção')
  }
}

async function resetPLC() {
  try {
    await axios.post('/clp/reset')
    alert('🔄 PLC resetado!')
  } catch (err) {
    alert('❌ Erro ao resetar PLC')
  }
}

async function abortarPedido() {
  try {
    await axios.post('/clp/abortar')
    alert('🛑 Pedido abortado!')
  } catch (err) {
    alert('❌ Erro ao abortar pedido')
  }
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">📋 Painel Administrativo</h1>

    <!-- Painéis disponíveis para Admin -->
    <PedidosPainel />
    <ProdutosPainel />
    <UsuariosPainel />

    <!-- 🔌 Controle do CLP -->
    <section class="mt-6">
      <h2 class="text-xl font-semibold mb-4">Controle do CLP</h2>
      <div class="flex gap-4">
        <button @click="iniciarProducao" class="bg-green-600 text-white px-4 py-2 rounded">
          🚀 Iniciar Produção
        </button>
        <button @click="resetPLC" class="bg-yellow-500 text-white px-4 py-2 rounded">
          🔄 Resetar PLC
        </button>
        <button @click="abortarPedido" class="bg-red-600 text-white px-4 py-2 rounded">
          🛑 Abortar Pedido
        </button>
      </div>
    </section>
  </div>
</template>
