// 📂 src/views/Login.vue
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
      <!-- Título -->
      <h1 class="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        🔑 Login
      </h1>

      <!-- Formulário -->
      <form @submit.prevent="login" class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="E-mail"
          autocomplete="email"
          class="w-full px-4 py-2 rounded-lg 
                 bg-gray-50 text-gray-800 placeholder-gray-400 
                 focus:ring-2 focus:ring-green-400 focus:outline-none
                 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        />

        <input
          v-model="senha"
          type="password"
          placeholder="Senha"
          autocomplete="current-password"
          class="w-full px-4 py-2 rounded-lg 
                 bg-gray-50 text-gray-800 placeholder-gray-400 
                 focus:ring-2 focus:ring-green-400 focus:outline-none
                 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        />

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-green-600 text-white font-bold rounded-lg shadow-md 
                 hover:bg-green-700 transition disabled:opacity-50"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <!-- Mensagem de erro -->
      <p v-if="erro" class="mt-4 text-red-500 dark:text-red-400 text-sm text-center">
        {{ erro }}
      </p>

      <!-- Link para cadastro -->
      <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Não tem conta?
        <router-link to="/cadastro" class="text-green-600 dark:text-green-400 font-semibold hover:underline">
          Cadastre-se
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const email = ref('')
const senha = ref('')
const erro = ref('')
const loading = ref(false)

const router = useRouter()
const userStore = useUserStore()

async function login() {
  try {
    loading.value = true
    await userStore.login({ email: email.value, senha: senha.value })

    if (userStore.isSuperAdmin) {
      router.push('/superadmin')
    } else if (userStore.isAdmin) {
      router.push('/admin')
    } else {
      router.push('/meus-pedidos')
    }
  } catch (err) {
    erro.value = userStore.error || 'Falha no login'
  } finally {
    loading.value = false
  }
}
</script>
