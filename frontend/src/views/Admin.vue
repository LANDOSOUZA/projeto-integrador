<template>
  <div class="p-6">
    <h1>Painel do Administrador</h1>

    <div v-if="pedidos.length === 0">
      <p>Não há pedidos no momento.</p>
    </div>

    <ul v-else>
      <li
        v-for="pedido in pedidos"
        :key="pedido.id"
        style="margin-bottom: 1rem; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem;"
      >
        <strong>Pedido #{{ pedido.id }}</strong><br />
        Itens:
        <ul>
          <li v-for="(item, i) in pedido.itens" :key="i">
            {{ item.nome }} - R$ {{ item.preco }}
          </li>
        </ul>
        <p><strong>Status atual:</strong> {{ pedido.status }}</p>

        <!-- Botões para atualizar status -->
        <div style="margin-top: 0.5rem;">
          <button @click="atualizarStatus(pedido.id, 'Iniciado')" style="margin-right: 0.5rem;">
            Marcar como Iniciado
          </button>
          <button @click="atualizarStatus(pedido.id, 'Em processamento')" style="margin-right: 0.5rem;">
            Marcar como Em processamento
          </button>
          <button @click="atualizarStatus(pedido.id, 'Pronto')">
            Marcar como Pronto
          </button>
        </div>
      </li>
    </ul>

    <!-- 🔹 Seção de Simulação MES -->
    <div style="margin-top: 2rem; padding: 1rem; background: #eee;">
      <h2>Simulação MES</h2>
      <p>O MES atualiza automaticamente pedidos em <strong>Em processamento</strong> para <strong>Pronto</strong> após 5 segundos.</p>
      <ul>
        <li v-for="(log, i) in logs" :key="i">{{ log }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePedidosStore } from '../stores/pedidos'

const pedidosStore = usePedidosStore()
const pedidos = pedidosStore.pedidos
const logs = ref([])

function atualizarStatus(id, novoStatus) {
  pedidosStore.atualizarStatus(id, novoStatus)

  if (novoStatus === 'Em processamento') {
    logs.value.push(`Pedido #${id} enviado ao MES...`)
    pedidosStore.simularMES(id, () => {
      logs.value.push(`Pedido #${id} atualizado para "Pronto" pelo MES`)
    })
  }
}
</script>
