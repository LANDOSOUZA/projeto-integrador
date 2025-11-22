// 📂 src/views/Admin.vue
<script setup>
import PedidosPainel from '../components/PedidosPainel.vue'
import ProdutosPainel from '../components/ProdutosPainel.vue'
import UsuariosPainel from '../components/UsuariosPainel.vue'
import { useToast } from 'vue-toastification'
import clpService from '../services/clpService'   // ✅ novo service

const toast = useToast()

// --- 🔌 Controle CLP ---
async function iniciarProducao() {
  try {
    await clpService.iniciarProducao()
    toast.success('🚀 Produção iniciada!')
  } catch (err) {
    toast.error('❌ Erro ao iniciar produção')
  }
}

async function resetPLC() {
  try {
    await clpService.resetPLC()
    toast.success('🔄 PLC resetado!')
  } catch (err) {
    toast.error('❌ Erro ao resetar PLC')
  }
}

async function abortarPedido() {
  try {
    await clpService.abortarPedido()
    toast.success('🛑 Pedido abortado!')
  } catch (err) {
    toast.error('❌ Erro ao abortar pedido')
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
