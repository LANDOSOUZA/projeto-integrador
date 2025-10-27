<template>
  <nav class="navbar">
    <RouterLink to="/" class="nav-link">🛍️ Loja</RouterLink>
    <RouterLink to="/carrinho" class="nav-link">🛒 Meu Carrinho</RouterLink>
    <RouterLink to="/meus-pedidos" class="nav-link">📦 Meus Pedidos</RouterLink>
    <RouterLink to="/login" class="nav-link">🔑 Entrar / Cadastrar</RouterLink>
    <RouterLink to="/admin" class="nav-link">⚙️ Administração</RouterLink>
  </nav>
</template>

<script setup>
// nada especial por enquanto
</script>

<style scoped>
.navbar {
  background: #333;
  padding: 1rem;
  margin-bottom: 1rem;
}

.nav-link {
  margin-right: 1rem;
  color: white;
  text-decoration: none;
}

.nav-link.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
