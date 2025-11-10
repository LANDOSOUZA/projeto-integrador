<template>
  <div>
    <Navbar v-if="exibirNavbar" />
    <main class="max-w-4xl mx-auto p-4">
      <router-view />
    </main>
    <footer class="text-center p-4 text-sm text-gray-500">
      &copy; {{ new Date().getFullYear() }} Lando Sucos. Todos os direitos reservados.
    </footer>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const rotasSemNavbar = ['/login', '/login-cadastro']
const exibirNavbar = !rotasSemNavbar.includes(route.path)
</script>


