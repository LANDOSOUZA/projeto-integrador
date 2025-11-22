<template>
  <div class="estoque">
    <h2>Estoque de Insumos</h2>
    <table>
      <thead>
        <tr>
          <th>Produto</th>
          <th>Quantidade</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="produto in produtos" :key="produto._id">
          <td>{{ produto.nome }}</td>
          <td :class="{ zerado: produto.quantidade === 0 }">
            {{ produto.quantidade }}
          </td>
          <td>
            <button @click="repor(produto._id)">Repor 3 peças</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "TelaEstoque",
  data() {
    return {
      produtos: [] // lista de insumos carregada do backend
    }
  },
  async created() {
    await this.carregarEstoque()
  },
  methods: {
    async carregarEstoque() {
      const resp = await fetch("/admin/estoque", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      this.produtos = await resp.json()
    },
    async repor(produtoId) {
      await fetch("/admin/repor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ produtoId, quantidade: 3 })
      })
      alert("Estoque reposto com sucesso!")
      await this.carregarEstoque()
    }
  }
}
</script>

<style>
.zerado {
  color: red;
  font-weight: bold;
}
</style>
