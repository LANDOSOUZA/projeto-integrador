<template>
  <div class="cadastro">
    <h1>Cadastro</h1>

    <form @submit.prevent="cadastrar">
      <input
        v-model="nome"
        type="text"
        placeholder="Nome"
        autocomplete="name"
      />

      <input
        v-model="email"
        type="email"
        placeholder="E-mail"
        autocomplete="email"
      />

      <input
        v-model="senha"
        type="password"
        placeholder="Senha"
        autocomplete="new-password"
      />

      <button type="submit" :disabled="loading">
        {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
      </button>
    </form>

    <p v-if="erro" style="color:red">{{ erro }}</p>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const nome = ref('')
const email = ref('')
const senha = ref('')
const erro = ref('')
const loading = ref(false)
const userStore = useUserStore()


async function cadastrar() {
  try {
    loading.value = true
    await userStore.cadastrar({
      nome: nome.value,
      email: email.value,
      senha: senha.value
    })
    alert('Usuário cadastrado com sucesso!')
    router.push('/meus-pedidos')   // ✅ já manda para pedidos
    // ou router.push('/carrinho') se quiser direto para finalizar compra
  } catch (err) {
    erro.value = userStore.error?.message || 'Erro ao cadastrar usuário'
  } finally {
    loading.value = false
  }
}
</script>