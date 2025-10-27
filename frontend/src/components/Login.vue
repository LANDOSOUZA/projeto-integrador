<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center mb-6">Login</h1>

      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Senha</label>
          <input
            v-model="password"
            type="password"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Entrar
        </button>
      </form>

      <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useUserStore } from "../stores/user"
import api from "../api"

const email = ref("")
const password = ref("")
const error = ref(null)

const userStore = useUserStore()

const login = async () => {
  try {
    error.value = null
    const response = await api.post("/cliente/login", {
      email: email.value,
      senha: password.value,
    })

    // Salva usuário e token no Pinia
    userStore.setUser({
      user: response.data.user,
      token: response.data.token,
    })

    alert("Login realizado com sucesso!")
    // Aqui você pode redirecionar para outra rota, ex: pedidos
  } catch (err) {
    error.value = err.response?.data?.message || "Erro ao fazer login"
  }
}
</script>
