<script setup>
import { onMounted } from 'vue'
import { usePedidosStore } from '../stores/pedidos'

import PedidosPainelAdmin from '../components/PedidosPainelAdmin.vue'
import ProdutosPainel from '../components/ProdutosPainel.vue'
import UsuariosPainel from '../components/UsuariosPainel.vue'
import { useToast } from 'vue-toastification'
import clpService from '../services/clpService'

const toast = useToast()
const pedidoStore = usePedidosStore()

onMounted(() => {
  // chama a action do store para carregar os pedidos
  pedidoStore.listarTodosPedidosAdmin()
})

async function reporEstoque(pedido, item) {
  try {
    const produtoId = item?.produtoId?._id || item?.produtoId
    if (!produtoId) {
      toast.error('❌ Produto inválido no item')
      return
    }

    const res = await clpService.atualizarStatusCLP(
      pedido._id,
      'em_processamento',
      produtoId
    )

    toast.success(res.data.mensagem)
    pedido.status = res.data.pedido.status
  } catch (err) {
    toast.error('❌ Erro ao repor estoque')
    console.error(err)
  }
}

const anteciparPedido = async (pedidoId) => {
  toast.info(`⏩ Pedido ${pedidoId} antecipado`)
}

const cancelarPedido = async (pedidoId) => {
  toast.info(`🛑 Pedido ${pedidoId} cancelado`)
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">📋 Painel Administrativo</h1>

    <PedidosPainelAdmin 
      @reporEstoque="reporEstoque" 
      @anteciparPedido="anteciparPedido" 
      @cancelarPedido="cancelarPedido" 
    />
    <ProdutosPainel />
    <UsuariosPainel />
  </div>
</template>
