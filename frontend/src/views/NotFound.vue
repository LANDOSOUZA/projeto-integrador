<!-- src/views/NotFound.vue -->
<template>
  <div class="not-found">
    <h1>404 - Página não encontrada</h1>
    <p>Desculpe, o endereço que você acessou não existe.</p>
    <RouterLink to="/">Voltar para a loja</RouterLink>
  </div>
</template>

<script setup>
// Nenhuma lógica necessária por enquanto
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 2rem;
}

.not-found h1 {
  font-size: 2rem;
  color: #c00;
}

.not-found a {
  display: inline-block;
  margin-top: 1rem;
  color: #007bff;
  text-decoration: underline;
}
</style>
