<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const erro = ref('')
const logs = ref([])

async function carregarUsuarios() {
  try {
    await userStore.listarUsuarios()
    logs.value.push(`Carregados ${userStore.usuarios.length} usuários`)
  } catch (err) {
    erro.value = 'Erro ao carregar usuários'
  }
}

async function promoverParaAdmin(id) {
  try {
    await userStore.atualizarRole(id, 'admin')
    logs.value.push(`Usuário ${id} promovido para Admin`)
    await carregarUsuarios()
  } catch {
    logs.value.push(`Erro ao promover usuário ${id}`)
  }
}

async function rebaixarParaCliente(id) {
  try {
    await userStore.atualizarRole(id, 'cliente')
    logs.value.push(`Usuário ${id} rebaixado para Cliente`)
    await carregarUsuarios()
  } catch {
    logs.value.push(`Erro ao rebaixar usuário ${id}`)
  }
}

async function desativarUsuario(id) {
  try {
    await userStore.atualizarStatus(id, 'inativo')
    logs.value.push(`Usuário ${id} desativado`)
    await carregarUsuarios()
  } catch {
    logs.value.push(`Erro ao desativar usuário ${id}`)
  }
}

async function excluirUsuario(id) {
  if (!confirm('Tem certeza que deseja excluir este usuário?')) return
  try {
    await userStore.excluirUsuario(id)
    logs.value.push(`Usuário ${id} excluído`)
    await carregarUsuarios()
  } catch {
    logs.value.push(`Erro ao excluir usuário ${id}`)
  }
}

onMounted(() => carregarUsuarios())
</script>

<template>
  <div class="p-4 bg-white rounded shadow mt-4">
    <h2 class="text-xl font-bold text-[#005CA9] mb-4">👥 Usuários</h2>

    <div v-if="erro" class="text-red-600 mb-2">{{ erro }}</div>

    <table v-if="userStore.usuarios && userStore.usuarios.length" class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2 text-left">Nome</th>
          <th class="p-2 text-left">E-mail</th>
          <th class="p-2 text-left">Papel</th>
          <th class="p-2 text-left">Status</th>
          <th class="p-2 text-left">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in userStore.usuarios" :key="usuario._id" class="border-b">
          <td class="p-2">{{ usuario.nome }}</td>
          <td class="p-2">{{ usuario.email }}</td>
          <td class="p-2">{{ usuario.role }}</td>
          <td class="p-2">
            <span
              class="px-2 py-1 rounded text-sm"
              :class="{
                'bg-green-100 text-green-800': usuario.status === 'ativo',
                'bg-red-100 text-red-800': usuario.status === 'inativo'
              }"
            >
              {{ usuario.status }}
            </span>
          </td>
          <td class="p-2 flex gap-2 flex-wrap">
            <button @click="promoverParaAdmin(usuario._id)" class="bg-blue-600 text-white px-2 py-1 rounded">
              ⬆️ Promover
            </button>
            <button @click="rebaixarParaCliente(usuario._id)" class="bg-yellow-600 text-white px-2 py-1 rounded">
              ⬇️ Rebaixar
            </button>
            <button @click="desativarUsuario(usuario._id)" class="bg-gray-600 text-white px-2 py-1 rounded">
              🛑 Desativar
            </button>
            <button @click="excluirUsuario(usuario._id)" class="bg-red-600 text-white px-2 py-1 rounded">
              ❌ Excluir
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="text-gray-600">Nenhum usuário encontrado.</div>

    <!-- Logs -->
    <div class="mt-4 bg-gray-100 p-2 rounded text-sm">
      <h3 class="font-semibold mb-2">Logs:</h3>
      <ul>
        <li v-for="(log, i) in logs" :key="i">• {{ log }}</li>
      </ul>
    </div>
  </div>
</template>

