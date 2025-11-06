<template>
  <div class="cadastro p-6 max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Criar Conta</h2>

    <form @submit.prevent="cadastrar">
      <input v-model="nome" type="text" placeholder="Nome" class="border p-2 w-full mb-2" required />
      <input v-model="email" type="email" placeholder="Email" class="border p-2 w-full mb-2" required />
      <input v-model="senha" type="password" placeholder="Senha" class="border p-2 w-full mb-2" required />

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
        Cadastrar
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'

const router = useRouter()
const nome = ref('')
const email = ref('')
const senha = ref('')

async function cadastrar() {
  try {
    await api.post('/cliente', {
      nome: nome.value,
      email: email.value,
      senha: senha.value
    })
    alert('Usuário cadastrado com sucesso!')
    router.push('/login')
  } catch (err) {
    console.error(err)
    alert(err.response?.data?.mensagem || 'Erro ao cadastrar usuário')
  }
}
</script>

