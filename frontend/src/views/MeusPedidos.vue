<script setup>
import { usePedidosStore } from '../stores/pedidos'

const pedidosStore = usePedidosStore()

// Exemplo de mapeamento de status → cor + label
const statusConfig = {
  iniciado: { label: 'Iniciado', cor: 'gray', icone: '⚪' },
  processamento: { label: 'Em processamento', cor: 'orange', icone: '🟠' },
  pronto: { label: 'Pronto', cor: 'green', icone: '🟢' }
}
</script>

<template>
  <div>
    <h2>📦 Meus Pedidos</h2>

    <div v-for="pedido in pedidosStore.pedidos" :key="pedido.id" class="pedido-card">
      <div class="pedido-header">
        <strong>#{{ pedido.id }}</strong>
        <span
          class="status"
          :style="{ color: statusConfig[pedido.status].cor }"
        >
          {{ statusConfig[pedido.status].icone }}
          {{ statusConfig[pedido.status].label }}
        </span>
      </div>

      <div class="pedido-body">
        <p><strong>Produto:</strong> {{ pedido.produto }}</p>
        <p><strong>Total:</strong> R$ {{ pedido.total.toFixed(2) }}</p>
        <p><strong>Data:</strong> {{ pedido.data }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pedido-card {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  background: #fafafa;
}

.pedido-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.status {
  font-weight: bold;
}
</style>
