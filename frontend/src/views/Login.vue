<template>
  <div class="p-6">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label>Email:</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Senha:</label>
        <input v-model="senha" type="password" required />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>

    <p v-if="erro" style="color:red;">{{ erro }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const senha = ref('')
const erro = ref('')
const loading = ref(false)
const router = useRouter()

async function login() {
  try {
    loading.value = true
    const { data } = await axios.post('http://localhost:3000/login', {
      email: email.value,
      senha: senha.value
    })

    // 🔹 Salva token e usuário
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    // 🔹 Redireciona conforme perfil
    if (data.user.status === 'admin') {
      router.push('/admin')
    } else {
      router.push('/meus-pedidos')
    }
  } catch (err) {
    erro.value = err.response?.data?.erro || 'Falha no login'
  } finally {
    loading.value = false
  }
}
</script>
