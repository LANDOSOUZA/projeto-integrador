// 📂 src/views/SuperAdmin.vue
<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'
import { useProdutoStore } from '../stores/produto'
import { usePedidosStore } from '../stores/pedidos'
import { useToast } from 'vue-toastification'
import clpService from '../services/clpService'   // ✅ novo service

const toast = useToast()
const novoNome = ref('')
const novoPreco = ref(0)

// Stores
const adminStore = useAdminStore()
const produtoStore = useProdutoStore()
const pedidoStore = usePedidosStore()

// Dados do novo admin
const novoAdmin = ref({ nome: '', email: '', senha: '' })
const loadingCriar = ref(false)
const loadingExcluir = ref(false)
const loadingPromover = ref(false)

onMounted(() => {
  adminStore.listarAdmins()
  // já carrega pedidos ao montar
  pedidoStore.listarTodosPedidosSuperadmin()
})


// Aba ativa da sidebar
const abaAtiva = ref('admins')

// Handlers para selecionar a aba
function irParaAdmins() { abaAtiva.value = 'admins' }
function irParaPedidos() { abaAtiva.value = 'pedidos' }
function irParaProdutos() { abaAtiva.value = 'produtos' }
function irParaConfiguracoes() { abaAtiva.value = 'configuracoes' }


// Criar novo admin
async function criarNovoAdmin() {
  loadingCriar.value = true
  try {
    await adminStore.criarAdmin(novoAdmin.value)
    toast.success('✅ Admin criado com sucesso!')
    novoAdmin.value = { nome: '', email: '', senha: '' }
  } catch (err) {
    toast.error('❌ Erro ao criar admin')
  } finally {
    loadingCriar.value = false
  }
}

// Excluir admin
async function excluirAdmin(id) {
  if (!confirm('Tem certeza que deseja excluir este admin?')) return
  loadingExcluir.value = true
  try {
    await adminStore.excluirAdmin(id)
    toast.success('🗑️ Admin excluído com sucesso!')
  } catch (err) {
    toast.error('❌ Erro ao excluir admin')
  } finally {
    loadingExcluir.value = false
  }
}

// Promover usuário
async function promoverUsuario(id, role) {
  loadingPromover.value = true
  try {
    await adminStore.atualizarRoleUsuario(id, role)
    toast.success(`✅ Usuário promovido para ${role}!`)
  } catch (err) {
    toast.error('❌ Erro ao promover usuário')
  } finally {
    loadingPromover.value = false
  }
}

// Carregar lista de admins
onMounted(() => {
  adminStore.listarAdmins()
})

// --- 🔌 Controle CLP ---
const loadingProducao = ref(false)
const loadingReset = ref(false)
const loadingAbortar = ref(false)

async function iniciarProducao() {
  loadingProducao.value = true
  try {
    await clpService.iniciarProducao()
    toast.success('🚀 Produção iniciada!')
  } catch (err) {
    toast.error('❌ Erro ao iniciar produção')
  } finally {
    loadingProducao.value = false
  }
}

async function resetPLC() {
  loadingReset.value = true
  try {
    await clpService.resetPLC()
    toast.success('🔄 PLC resetado!')
  } catch (err) {
    toast.error('❌ Erro ao resetar PLC')
  } finally {
    loadingReset.value = false
  }
}

async function abortarPedido() {
  loadingAbortar.value = true
  try {
    await clpService.abortarPedido()
    toast.success('🛑 Pedido abortado!')
  } catch (err) {
    toast.error('❌ Erro ao abortar pedido')
  } finally {
    loadingAbortar.value = false
  }
}

// --- ⚙️ Configurações globais ---
const loadingCounters = ref(false)
const loadingProdutosBase = ref(false)
const loadingAdminRoot = ref(false)

async function resetarCounters() {
  loadingCounters.value = true
  try {
    await fetch('/clp/reset-counters', { method: 'POST' })
    toast.success('⚙️ Counters resetados com sucesso!')
  } catch (err) {
    toast.error('❌ Erro ao resetar counters')
  } finally {
    loadingCounters.value = false
  }
}

async function garantirProdutosBase() {
  loadingProdutosBase.value = true
  try {
    await fetch('/clp/garantir-produtos-base', { method: 'POST' })
    toast.success('🍹 Produtos base garantidos!')
  } catch (err) {
    toast.error('❌ Erro ao garantir produtos base')
  } finally {
    loadingProdutosBase.value = false
  }
}

async function recriarAdminRoot() {
  loadingAdminRoot.value = true
  try {
    await fetch('/clp/recriar-admin-root', { method: 'POST' })
    toast.success('👑 SuperAdmin root recriado!')
  } catch (err) {
    toast.error('❌ Erro ao recriar SuperAdmin root')
  } finally {
    loadingAdminRoot.value = false
  }
}

async function liberarParaProducao(id) {
  try {
    await pedidoStore.liberarParaProducao(id)
    toast.success('🚀 Pedido liberado para produção!')
  } catch (err) {
    toast.error('❌ Erro ao liberar pedido')
  }
}


</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#005CA9] text-white flex flex-col p-4">
      <h2 class="text-xl font-bold mb-6">👑 SuperAdmin</h2>
      <nav class="flex flex-col gap-3">
        <button @click="irParaAdmins"
                class="text-left p-2 rounded"
                :class="abaAtiva === 'admins' ? 'bg-blue-800' : 'hover:bg-blue-700'">
          📋 Admins
        </button>

        <button @click="irParaPedidos"
                class="text-left p-2 rounded"
                :class="abaAtiva === 'pedidos' ? 'bg-blue-800' : 'hover:bg-blue-700'">
          🛒 Pedidos
        </button>

        <button @click="irParaProdutos"
                class="text-left p-2 rounded"
                :class="abaAtiva === 'produtos' ? 'bg-blue-800' : 'hover:bg-blue-700'">
          📦 Produtos
        </button>

        <button @click="irParaConfiguracoes"
                class="text-left p-2 rounded"
                :class="abaAtiva === 'configuracoes' ? 'bg-blue-800' : 'hover:bg-blue-700'">
          ⚙️ Configurações
        </button>
      </nav>
    </aside>

    <!-- Conteúdo principal -->
    <main class="flex-1 p-6 overflow-y-auto">
      <h1 class="text-3xl font-bold text-[#005CA9] mb-6">Painel do SuperAdmin</h1>

      <!-- Aba: Admins -->
      <section v-if="abaAtiva === 'admins'" class="mb-10">
        <h2 class="text-xl font-semibold mb-4">Gerenciar Admins</h2>

        <!-- Formulário -->
        <form @submit.prevent="criarNovoAdmin" class="mb-6 flex gap-2">
          <input v-model="novoAdmin.nome" placeholder="Nome" class="border p-2 rounded w-1/4" autocomplete="name" />
          <input v-model="novoAdmin.email" type="email" placeholder="Email" class="border p-2 rounded w-1/3" autocomplete="email" />
          <input v-model="novoAdmin.senha" type="password" placeholder="Senha" class="border p-2 rounded w-1/4" autocomplete="new-password" />
          <button class="bg-purple-600 text-white px-4 py-2 rounded" :disabled="loadingCriar">
            {{ loadingCriar ? '⏳ Criando...' : 'Criar Admin' }}
          </button>
        </form>

        <!-- Lista -->
        <ul>
          <li v-for="admin in adminStore.admins" :key="admin._id" class="flex justify-between items-center border-b py-2">
            <span>{{ admin.nome }} — {{ admin.email }} ({{ admin.role }})</span>
            <div class="flex gap-2">
              <button @click="promoverUsuario(admin._id, 'admin')" class="bg-blue-500 text-white px-2 py-1 rounded" :disabled="loadingPromover">
                {{ loadingPromover ? '⏳...' : '🔄 Tornar Admin' }}
              </button>
              <button @click="promoverUsuario(admin._id, 'superadmin')" class="bg-green-600 text-white px-2 py-1 rounded" :disabled="loadingPromover">
                {{ loadingPromover ? '⏳...' : '👑 Tornar SuperAdmin' }}
              </button>
              <button @click="excluirAdmin(admin._id)" class="bg-red-500 text-white px-2 py-1 rounded" :disabled="loadingExcluir">
                {{ loadingExcluir ? '⏳...' : '🗑️ Excluir' }}
              </button>
            </div>
          </li>
        </ul>
      </section>

      <!-- Aba: Pedidos -->
      <section v-if="abaAtiva === 'pedidos'" class="mb-10">
        <h2 class="text-xl font-semibold mb-4">Pedidos</h2>

        <!-- Ações rápidas -->
        <div class="flex gap-3 mb-4">
          <button @click="pedidoStore.listarTodosPedidosSuperadmin()"
                  class="bg-blue-600 text-white px-4 py-2 rounded">
            🔄 Recarregar pedidos
          </button>
          <button @click="pedidoStore.excluirTodosPedidosSuperadmin()"
                  class="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded">
            🛑 Excluir todos os pedidos
          </button>
        </div>

        <!-- Lista de pedidos -->
        <ul v-if="pedidoStore.pedidos.length">
          <li v-for="pedido in pedidoStore.pedidos" :key="pedido._id"
              class="border rounded p-3 mb-3 flex items-start justify-between">
            <div class="space-y-1">
              <div class="font-medium">
                <strong>#{{ pedido.numero || pedido._id.slice(-6) }}</strong>
                — {{ pedidoStore.formatarStatus(pedido.status) }}
              </div>
              <div class="text-sm text-gray-600">
                {{ pedidoStore.formatarData(pedido.dataCriacao || pedido.createdAt) }}
                — Total: R$ {{ pedido.total }}
              </div>
              <div class="text-sm">
                <span class="font-semibold">Itens:</span>
                <span v-if="Array.isArray(pedido.itens)">
                  {{ pedido.itens.map(i => `${i.nome || i.produtoId?.nome} x${i.quantidade}`).join(', ') }}
                </span>
              </div>

              <!-- Botões de ação -->
              <div class="flex gap-2">
                <!-- Liberar para produção -->
                <button @click="liberarParaProducao(pedido._id)" 
                        class="bg-blue-600 text-white px-3 py-1 rounded">
                  🚀 Liberar para produção
                </button>

                <!-- Cancelar -->
                <button @click="pedidoStore.cancelarPedido(pedido._id)" 
                        class="bg-red-600 text-white px-3 py-1 rounded">
                  🗑️ Cancelar
                </button>
              </div>
            </div>
          </li>
        </ul>

        <!-- Estado vazio -->
        <div v-else class="text-gray-600">
          Nenhum pedido encontrado. Clique em “Recarregar pedidos”.
        </div>
               
      </section>
      <!-- Aba: Produtos -->
      <section v-if="abaAtiva === 'produtos'" class="mb-10">
        <h2 class="text-xl font-semibold mb-4">Produtos</h2>

        <!-- Botão para recarregar -->
        <button @click="produtoStore.listarProdutos()" 
                class="bg-blue-600 text-white px-4 py-2 rounded mb-4">
          🔄 Recarregar produtos
        </button>

        <!-- Formulário de cadastro -->
        <form @submit.prevent="produtoStore.cadastrarProduto({ nome: novoNome, preco: novoPreco })" 
              class="flex gap-2 mb-6">
          <input v-model="novoNome" placeholder="Nome do produto" class="border p-2 rounded w-1/3" />
          <input v-model="novoPreco" type="number" placeholder="Preço" class="border p-2 rounded w-1/3" />
          <button class="bg-green-600 text-white px-4 py-2 rounded">➕ Adicionar</button>
        </form>

        <!-- Lista de produtos -->
        <ul>
          <li v-for="produto in produtoStore.produtosOrdenados" :key="produto._id" 
              class="border-b py-2 flex justify-between">
            <span>{{ produto.nome }} — R$ {{ produto.preco }} — {{ produto.status }}</span>
            <div class="flex gap-2">
              <button @click="produtoStore.atualizarStatusProduto(produto._id, 'ativo')" 
                      class="bg-blue-500 text-white px-2 py-1 rounded">
                ✅ Ativar
              </button>
              <button @click="produtoStore.atualizarStatusProduto(produto._id, 'inativo')" 
                      class="bg-yellow-500 text-white px-2 py-1 rounded">
                ⏸️ Inativar
              </button>
              <button @click="produtoStore.excluirProduto(produto._id)" 
                      class="bg-red-600 text-white px-2 py-1 rounded">
                🗑️ Excluir
              </button>
            </div>
          </li>
        </ul>
      </section>


      <!-- Aba: Configurações -->
      <section v-if="abaAtiva === 'configuracoes'" class="mb-10">
        <h2 class="text-xl font-semibold mb-4">Configurações Globais</h2>
        <div class="flex flex-col gap-4">
          <button @click="resetarCounters" class="bg-blue-600 text-white px-4 py-2 rounded" :disabled="loadingCounters">
            {{ loadingCounters ? '⏳ Resetando...' : '⚙️ Resetar Counters' }}
          </button>
          <button @click="garantirProdutosBase" class="bg-green-600 text-white px-4 py-2 rounded" :disabled="loadingProdutosBase">
            {{ loadingProdutosBase ? '⏳ Garantindo...' : '🍹 Garantir Produtos Base' }}
          </button>
          <button @click="recriarAdminRoot" class="bg-purple-600 text-white px-4 py-2 rounded" :disabled="loadingAdminRoot">
            {{ loadingAdminRoot ? '⏳ Recriando...' : '👑 Recriar SuperAdmin Root' }}
          </button>
        </div>
      </section>

      <!-- 🔌 Controle do CLP (sempre visível) -->
      <section>
        <h2 class="text-xl font-semibold mb-4">Controle do CLP</h2>
        <div class="flex gap-4">
          <button @click="iniciarProducao" class="bg-green-600 text-white px-4 py-2 rounded" :disabled="loadingProducao">
            {{ loadingProducao ? '⏳ Iniciando...' : '🚀 Iniciar Produção' }}
          </button>
          <button @click="resetPLC" class="bg-yellow-500 text-white px-4 py-2 rounded" :disabled="loadingReset">
            {{ loadingReset ? '⏳ Resetando...' : '🔄 Resetar PLC' }}
          </button>
          <button @click="abortarPedido" class="bg-red-600 text-white px-4 py-2 rounded" :disabled="loadingAbortar">
            {{ loadingAbortar ? '⏳ Abortando...' : '🛑 Abortar Pedido' }}
          </button>
        </div>
      </section>
    </main>
  </div>
</template>
