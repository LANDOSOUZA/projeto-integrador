<template>
  <nav class="flex flex-wrap gap-4 items-center bg-green-400 p-4 shadow-md">
    <!-- Links principais -->
    <RouterLink to="/" class="px-3 py-2 rounded bg-orange-500 text-white hover:bg-yellow-400 transition">
      🛍️ Loja
    </RouterLink>
    <RouterLink to="/carrinho" class="px-3 py-2 rounded bg-orange-500 text-white hover:bg-yellow-400 transition">
      🛒 Meu Carrinho
    </RouterLink>
    <RouterLink to="/meus-pedidos" class="px-3 py-2 rounded bg-orange-500 text-white hover:bg-yellow-400 transition">
      📦 Meus Pedidos
    </RouterLink>

    <!-- Login -->
    <RouterLink
      v-if="!userStore.isAuthenticated"
      to="/login"
      class="px-3 py-2 rounded bg-orange-500 text-white hover:bg-yellow-400 transition ml-auto"
    >
      🔑 Entrar / Cadastrar
    </RouterLink>

    <!-- Admin -->
    <RouterLink
      v-if="userStore.isAdmin"
      to="/admin"
      class="px-3 py-2 rounded bg-orange-500 text-white hover:bg-yellow-400 transition"
    >
      ⚙️ Administração
    </RouterLink>

    <!-- SuperAdmin -->
    <RouterLink
      v-if="userStore.isSuperAdmin"
      to="/superadmin"
      class="px-3 py-2 rounded bg-orange-500 text-white hover:bg-yellow-400 transition"
    >
      👑 SuperAdmin
    </RouterLink>

    <!-- Saudação + Logout -->
    <div v-if="userStore.isAuthenticated" class="flex items-center gap-2 ml-auto">
      <span class="text-white font-semibold">👋 Olá, {{ userStore.user?.nome || 'Usuário' }}</span>
      <button
        @click="logout"
        class="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
      >
        🚪 Sair
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

function logout() {
  userStore.logout()
  router.push('/produtos')
}
</script>
