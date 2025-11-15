<template>
  <nav class="flex gap-4 items-center bg-gray-100 p-4">
    <RouterLink to="/" class="px-3 py-2 rounded hover:bg-gray-200 transition">🛍️ Loja</RouterLink>
    <RouterLink to="/carrinho" class="px-3 py-2 rounded hover:bg-gray-200 transition">🛒 Meu Carrinho</RouterLink>
    <RouterLink to="/meus-pedidos" class="px-3 py-2 rounded hover:bg-gray-200 transition">📦 Meus Pedidos</RouterLink>

    <RouterLink v-if="!userStore.isAuthenticated" to="/login" class="px-3 py-2 rounded hover:bg-gray-200 transition">
      🔑 Entrar / Cadastrar
    </RouterLink>

    <RouterLink v-if="userStore.isAdmin" to="/admin" class="px-3 py-2 rounded hover:bg-gray-200 transition">
      ⚙️ Administração
    </RouterLink>

    <RouterLink v-if="userStore.isSuperAdmin" to="/superadmin" class="px-3 py-2 rounded hover:bg-gray-200 transition">
      👑 SuperAdmin
    </RouterLink>

    <button v-if="userStore.isAuthenticated" @click="logout" class="px-3 py-2 rounded hover:bg-gray-200 transition">
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
