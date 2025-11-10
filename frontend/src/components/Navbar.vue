<template>
  <nav class="navbar">
    <RouterLink to="/" class="nav-link">🛍️ Loja</RouterLink>
    <RouterLink to="/carrinho" class="nav-link">🛒 Meu Carrinho</RouterLink>
    <RouterLink to="/meus-pedidos" class="nav-link">📦 Meus Pedidos</RouterLink>

    <!-- Mostrar login/cadastro se não autenticado -->
    <RouterLink to="/login" class="nav-link" v-if="!userStore.isAuthenticated">
      🔑 Entrar / Cadastrar
    </RouterLink>

    <!-- Admin e Superadmin -->
    <RouterLink v-if="userStore.isAdmin" to="/admin" class="nav-link">
      ⚙️ Administração
    </RouterLink>

    <!-- Exclusivo Superadmin -->
    <RouterLink v-if="userStore.isSuperAdmin" to="/superadmin" class="nav-link">
      👑 SuperAdmin
    </RouterLink>

    <!-- Logout -->
    <button v-if="userStore.isAuthenticated" @click="logout" class="nav-link">
      🚪 Sair
    </button>
  </nav>
</template>

<script setup>
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

function logout() {
  userStore.logout()
}
</script>

