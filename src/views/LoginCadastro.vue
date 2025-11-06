<template>
  <div class="p-6 max-w-md mx-auto bg-white shadow rounded">
    <h1 class="text-2xl font-bold mb-4 text-center">
      {{ modo === 'login' ? 'Entrar' : 'Cadastrar' }}
    </h1>

    <form @submit.prevent="modo === 'login' ? fazerLogin() : fazerCadastro()" class="space-y-4">
      <div>
        <label class="block mb-1">Email:</label>
        <input v-model="email" type="email" required
               class="border rounded w-full p-2 focus:outline-none focus:ring focus:border-blue-400" />
      </div>

      <div>
        <label class="block mb-1">Senha:</label>
        <input v-model="senha" type="password" required minlength="6"
               class="border rounded w-full p-2 focus:outline-none focus:ring focus:border-blue-400" />
      </div>

      <div v-if="modo === 'cadastro'">
        <label class="block mb-1">Nome:</label>
        <input v-model="nome" type="text" required
               class="border rounded w-full p-2 focus:outline-none focus:ring focus:border-blue-400" />
      </div>

      <button type="submit" :disabled="loading"
              class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50">
        {{ loading ? 'Enviando...' : modo === 'login' ? 'Entrar' : 'Cadastrar' }}
      </button>
    </form>

    <p v-if="erro" class="text-red-600 mt-2 text-center">{{ erro }}</p>

    <p class="mt-4 text-center">
      <button @click="alternarModo" class="text-blue-600 underline">
        {{ modo === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar' }}
      </button>
    </p>
  </div>
</template>



<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'
import { api } from '../services/api'

const modo = ref('login')
const email = ref('')
const senha = ref('')
const nome = ref('')
const erro = ref('')
const loading = ref(false)

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

function alternarModo() {
  modo.value = modo.value === 'login' ? 'cadastro' : 'login'
  erro.value = ''
}

async function fazerLogin() {
  try {
    loading.value = true

    console.log("Payload enviado:", {
      email: email.value,
      senha: senha.value
    })

    const { data } = await api.post('/cliente/login', {
      email: email.value,
      senha: senha.value
    })

    console.log("Resposta do backend:", data)

    // Aceita tanto data.user quanto data.cliente
    const usuario = data.user || data.cliente

    if (!data.token || !usuario) {
      throw new Error("Resposta inesperada do servidor")
    }

    userStore.setToken(data.token)
    userStore.setUser(usuario)

    const destino =
      route.query.redirect ||
      (usuario.status === 'admin' ? '/admin' : '/meus-pedidos')

    router.push(destino)

  } catch (err) {
    console.error("Erro no login:", err)
    erro.value = err.response?.data?.erro || err.message || 'Erro ao fazer login'
  } finally {
    loading.value = false
  }
}

async function fazerCadastro() {
  try {
    loading.value = true
    console.log("Payload enviado:", {
      email: email.value,
      senha: senha.value
    })

    await api.post('/cliente/cadastrar', {
      nome: nome.value,
      email: email.value,
      senha: senha.value
    })

    alert('Cadastro realizado com sucesso! Faça login.')
    alternarModo()
  } catch (err) {
    erro.value = err.response?.data?.erro || 'Erro ao cadastrar'
  } finally {
    loading.value = false
  }
}
</script>
