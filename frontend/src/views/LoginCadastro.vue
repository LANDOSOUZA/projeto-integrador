<template>
  <div class="p-6 max-w-md mx-auto">
    <h1>{{ modo === 'login' ? 'Entrar' : 'Cadastrar' }}</h1>

    <form @submit.prevent="modo === 'login' ? fazerLogin() : fazerCadastro()">
      <div>
        <label>Email:</label>
        <input v-model="email" type="email" required />
      </div>

      <div>
        <label>Senha:</label>
        <input v-model="senha" type="password" required minlength="6" />
      </div>

      <div v-if="modo === 'cadastro'">
        <label>Nome:</label>
        <input v-model="nome" type="text" required />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Enviando...' : modo === 'login' ? 'Entrar' : 'Cadastrar' }}
      </button>
    </form>

    <p v-if="erro" style="color:red;">{{ erro }}</p>

    <p style="margin-top: 1rem;">
      <button @click="alternarModo">
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
    const { data } = await api.post('/login', {
      email: email.value,
      senha: senha.value
    })

    userStore.setToken(data.token)
    userStore.setUser(data.user)

    const destino = route.query.redirect || (data.user.status === 'admin' ? '/admin' : '/meus-pedidos')
    router.push(destino)
  } catch (err) {
    erro.value = err.response?.data?.erro || 'Erro ao fazer login'
  } finally {
    loading.value = false
  }
}

async function fazerCadastro() {
  try {
    loading.value = true
    await api.post('/usuarios', {
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
