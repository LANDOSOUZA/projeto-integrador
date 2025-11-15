<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const periodo = ref('mensal') // período padrão
const dados = ref([])
const carregando = ref(false)
const erro = ref(null)

async function carregarRelatorio() {
  carregando.value = true
  erro.value = null
  try {
    const { data } = await axios.get(`/relatorio/balancete?periodo=${periodo.value}`)
    dados.value = data.resumo
  } catch (err) {
    erro.value = err.response?.data || err.message
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  carregarRelatorio()
})
</script>

<template>
  <div class="p-4 bg-white rounded shadow">
    <h2 class="text-xl font-bold text-[#005CA9]">📊 Relatório de Produção</h2>

    <div class="mb-4">
      <label for="periodo" class="mr-2">Período:</label>
      <select id="periodo" v-model="periodo" @change="carregarRelatorio">
        <option value="diario">Diário</option>
        <option value="semanal">Semanal</option>
        <option value="mensal">Mensal</option>
        <option value="bimestral">Bimestral</option>
        <option value="trimestral">Trimestral</option>
        <option value="semestral">Semestral</option>
        <option value="anual">Anual</option>
      </select>
    </div>

    <div v-if="carregando">Carregando relatório...</div>
    <div v-else-if="erro" class="text-red-600">Erro: {{ erro }}</div>
    <div v-else>
      <Bar
        :data="{
          labels: dados.map(d => d._id), // nomes dos produtos
          datasets: [{
            label: 'Quantidade Produzida',
            data: dados.map(d => d.quantidadeTotal),
            backgroundColor: ['#facc15', '#f97316', '#9333ea'] // cores: abacaxi, laranja, uva
          }]
        }"
        :options="{
          responsive: true,
          plugins: {
            legend: { display: true },
            title: { display: true, text: 'Produção por sabor' }
          }
        }"
      />
    </div>
  </div>
</template>
