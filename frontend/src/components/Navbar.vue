<template>
  <nav class="navbar">
    <RouterLink to="/" class="nav-link">🛍️ Loja</RouterLink>
    <RouterLink to="/carrinho" class="nav-link">🛒 Meu Carrinho</RouterLink>
    <RouterLink to="/meus-pedidos" class="nav-link">📦 Meus Pedidos</RouterLink>
    <RouterLink to="/login" class="nav-link">🔑 Entrar / Cadastrar</RouterLink>
    <RouterLink to="/admin" class="nav-link" v-if="isAdmin">⚙️ Administração</RouterLink>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isAdmin = ref(false)

onMounted(() => {
  // Verifica se há token de admin no localStorage
  isAdmin.value = !!localStorage.getItem('adminToken')
})
</script>

<style scoped>
.navbar {
  background: #333;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
}

.nav-link {
  margin-right: 1rem;
  color: white;
  text-decoration: none;
}

.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}

@media (max-width: 600px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-link {
    margin: 0.5rem 0;
  }
}
</style>
