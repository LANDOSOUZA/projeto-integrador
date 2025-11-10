<script setup>
import { ref } from 'vue'
import PedidosPainel from '../components/PedidosPainel.vue'
import AdminPrincipal from '../components/AdminPrincipal.vue'

const usuario = ref({ role: 'admin_principal' }) 
// 👉 depois você troca para vir do login/JWT
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Painel Administrativo</h1>

    <!-- Todos os admins veem pedidos -->
    <PedidosPainel />

    <!-- Só o admin principal vê gestão de admins -->
    <div v-if="usuario.role === 'admin_principal'" class="mt-10">
      <AdminPrincipal />
    </div>
  </div>
</template>
