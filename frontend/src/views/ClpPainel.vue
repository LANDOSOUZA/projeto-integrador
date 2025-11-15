<script setup>
import { onMounted } from 'vue'
import { useClpStore } from '../stores/clp'

const clpStore = useClpStore()

onMounted(() => {
  // Carrega status inicial e atualiza a cada 2 segundos
  clpStore.lerStatus()
  setInterval(() => clpStore.lerStatus(), 2000)
})
</script>

<template>
  <div class="p-4 bg-white rounded shadow">
    <h2 class="text-xl font-bold text-[#005CA9]">🔌 Status do CLP</h2>

    <div v-if="clpStore.loading">Carregando...</div>
    <div v-else-if="clpStore.error" class="text-red-600">Erro: {{ clpStore.error }}</div>
    <div v-else>
      <p><strong>Estado geral:</strong> {{ clpStore.status.geral }}</p>
      <p><strong>OP atual:</strong> {{ clpStore.status.opAtual }}</p>
      <p><strong>Falha ativa:</strong> {{ clpStore.status.falhaAtiva }}</p>
      <p><strong>Código da falha:</strong> {{ clpStore.status.falhaAtivaCod }}</p>
      <p><strong>Produzido:</strong> {{ clpStore.status.mesProd }}</p>
      <p><strong>Faltante:</strong> {{ clpStore.status.mesFalt }}</p>
      <p><strong>Último ciclo:</strong> {{ clpStore.status.mesUltimoCiclo }} s</p>
      <p><strong>Início:</strong> {{ clpStore.status.mesTempInicio }}</p>
      <p><strong>Fim:</strong> {{ clpStore.status.mesTempFim }}</p>
      <p><strong>Peças boas:</strong> {{ clpStore.status.mesPcsBoas }}</p>
      <p><strong>Peças ruins:</strong> {{ clpStore.status.mesPcsRuins }}</p>
    </div>
  </div>
</template>
