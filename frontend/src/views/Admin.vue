<script setup>
import PedidosPainel from '../components/PedidosPainel.vue'
import ProdutosPainel from '../components/ProdutosPainel.vue'
import UsuariosPainel from '../components/UsuariosPainel.vue'
//import EstoquePainel from '../components/EstoquePainel.vue'
import { useToast } from 'vue-toastification'
import clpService from '../services/clpService'

const toast = useToast()

// --- 🔌 Helper para ações do CLP ---
async function executarAcaoCLP(acao, mensagemSucesso, mensagemErro) {
  try {
    await clpService[acao]()
    toast.success(mensagemSucesso)
  } catch {
    toast.error(mensagemErro)
  }
}

// funções que usam o helper
const iniciarProducao = () =>
  executarAcaoCLP('iniciarProducao', '🚀 Produção iniciada!', '❌ Erro ao iniciar produção')

const resetPLC = () =>
  executarAcaoCLP('resetPLC', '🔄 PLC resetado!', '❌ Erro ao resetar PLC')

const abortarPedido = () =>
  executarAcaoCLP('abortarPedido', '🛑 Pedido abortado!', '❌ Erro ao abortar pedido')

// 👉 Nova função para repor estoque
async function reporEstoque(pedido, item) {
  try {
    const res = await clpService.atualizarStatusCLP(
      pedido._id,        // id do pedido
      pedido.status,     // status atual
      item.produtoId._id // id do produto no Mongo
    )
    toast.success(res.data.message)
  } catch (err) {
    toast.error('❌ Erro ao repor estoque')
    console.error(err)
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
