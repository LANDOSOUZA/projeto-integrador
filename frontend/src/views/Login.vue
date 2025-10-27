<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

const email = ref('')
const password = ref('')
const userStore = useUserStore()

function handleLogin() {
  // salva no Pinia
  userStore.setToken('meu-token-falso')
  userStore.setUser({ email: email.value })

  // logs de teste
  console.log('E-mail:', email.value)
  console.log('Senha:', password.value)
  console.log('Token salvo no Pinia:', userStore.token)
  console.log('Usuário salvo no Pinia:', userStore.user)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center text-blue-600 mb-6">
        Login
      </h1>
      <form class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
          <input
            id="email"
            type="email"
            v-model="email"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="seu@email.com"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
          <input
            id="password"
            type="password"
            v-model="password"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Entrar
        </button>
      </form>
    </div>
  </div>
</template>
