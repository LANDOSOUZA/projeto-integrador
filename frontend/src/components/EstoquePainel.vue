<template>
  <!-- Componente desativado -->
</template>

<script>
export default {
  name: "EstoqueDesativado"
}
</script>

<!--
<template>
  <section class="mt-6">
    <h2 class="text-xl font-semibold mb-4">📦 Estoque de Insumos</h2>
    <table class="w-full border">
      <thead>
        <tr>
          <th class="border px-2">Produto</th>
          <th class="border px-2">Ação</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="produto in produtos" :key="produto._id">
          <td class="border px-2">{{ produto.nome }}</td>
          <td class="border px-2 text-center">
            <button
              @click="repor(produto._id)"
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              🔄 Repor 3 {{ produto.nome }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import estoqueService from '../services/estoqueService.js'

const produtos = ref([])

async function carregarEstoque() {
  try {
    const resp = await estoqueService.listar()
    produtos.value = resp.data
  } catch (err) {
    console.error('Erro ao carregar estoque', err)
  }
}

async function repor(produtoId) {
  try {
    const produto = produtos.value.find(p => p._id === produtoId)
    await estoqueService.repor(produtoId)
    alert(`✅ Estoque de ${produto.nome} reposto (+3 unidades)!`)
    await carregarEstoque()
  } catch (err) {
    console.error('Erro ao repor estoque', err)
  }
}

onMounted(carregarEstoque)
</script>
-->