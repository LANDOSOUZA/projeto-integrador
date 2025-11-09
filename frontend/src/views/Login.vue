<template>
  <div class="login">
    <h1>Login</h1>

    <form @submit.prevent="login">
      <input
        v-model="email"
        type="email"
        placeholder="E-mail"
        autocomplete="username"
      />

      <input
        v-model="senha"
        type="password"
        placeholder="Senha"
        autocomplete="current-password"
      />

      <button type="submit" :disabled="loading">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>

    <p v-if="erro" style="color:red">{{ erro }}</p>

    <router-link to="/cadastro">
      Não tem conta? Cadastre-se
    </router-link>
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

    const usuario = userStore.user
    if (usuario?.status === 'admin') {
      router.push('/admin')
    } else {
      router.push('/meus-pedidos')
    }
  } catch (err) {
    erro.value = userStore.error?.message || 'Falha no login'
  } finally {
    loading.value = false
  }
}
</script>
