<!-- 📂 src/views/SuperAdmin.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'
import { useProdutoStore } from '../stores/produto'
import { usePedidosStore } from '../stores/pedidos'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import clpService from '../services/clpService'

const toast = useToast()

// Stores
const adminStore = useAdminStore()
const produtoStore = useProdutoStore()
const pedidoStore = usePedidosStore()

// Expor dados dos stores para o template
const { admins } = storeToRefs(adminStore)
const { produtos } = storeToRefs(produtoStore)
const { pedidos } = storeToRefs(pedidoStore) // já reativo

// Estados locais
const abaAtiva = ref('admins')
const novoAdmin = ref({ nome: '', email: '', senha: '' })
const novoNome = ref('')
const novoPreco = ref(0)

// Loadings extras
const loadingProduto = ref(false)
const loadingCliente = ref(false)
const loadingAdmin = ref(false)
const loadingProducao = ref(false)
const loadingAbortar = ref(false)
const loadingCounters = ref(false)
const loadingReset = ref(false)
const loadingCriar = ref(false)

// Carregar dados iniciais
onMounted(async () => {
  try {
    await adminStore.listarAdmins()
    await produtoStore.listarProdutos()
    await pedidoStore.listarTodosPedidosSuperadmin()
    console.log('[STORE] pedidos carregados (superadmin):', JSON.stringify(pedidos.value, null, 2))
  } catch (err) {
    console.error('[SuperAdmin.vue] erro ao carregar dados iniciais:', err)
  }
})

// Navegação
function irParaAdmins() { abaAtiva.value = 'admins' }
function irParaPedidos() { abaAtiva.value = 'pedidos' }
function irParaProdutos() { abaAtiva.value = 'produtos' }
function irParaConfiguracoes() { abaAtiva.value = 'configuracoes' }
function irParaEstoque() { abaAtiva.value = 'estoque' }

function formatCurrency(value) {
  if (value == null) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(value))
}

// --- Admin ---
async function criarNovoAdmin() {
  loadingCriar.value = true
  try {
    await adminStore.criarAdmin(novoAdmin.value)
    toast.success('✅ Admin criado com sucesso!')
    novoAdmin.value = { nome: '', email: '', senha: '' }
    await adminStore.listarAdmins()
  } catch {
    toast.error('❌ Erro ao criar admin')
  } finally {
    loadingCriar.value = false
  }
}

async function excluirAdmin(id) {
  if (!confirm('Tem certeza que deseja excluir este admin?')) return
  loadingExcluir.value = true
  try {
    await adminStore.excluirAdmin(id)
    toast.success('🗑️ Admin excluído com sucesso!')
    await adminStore.listarAdmins()
  } catch {
    toast.error('❌ Erro ao excluir admin')
  } finally {
    loadingExcluir.value = false
  }
}

async function promoverUsuario(id, role) {
  loadingPromover.value = true
  try {
    await adminStore.atualizarRoleUsuario(id, role)
    toast.success(`✅ Usuário promovido para ${role}!`)
    await adminStore.listarAdmins()
  } catch {
    toast.error('❌ Erro ao promover usuário')
  } finally {
    loadingPromover.value = false
  }
}

// --- Pedidos ---
async function liberarParaProducao(id) {
  try {
    await pedidoStore.liberarParaProducao(id)
    toast.success('🚀 Pedido liberado para produção!')
    await pedidoStore.listarTodosPedidosSuperadmin()
  } catch {
    toast.error('❌ Erro ao liberar pedido')
  }
}

async function reporEstoque(pedido) {
  try {
    if (!pedido || !Array.isArray(pedido.itens) || pedido.itens.length === 0) {
      throw new Error('Pedido sem itens')
    }

    // 👉 Aqui você coloca o log
    console.log('Primeiro item do pedido:', pedido.itens[0])

    const primeiroItem = pedido.itens[0]

    const produtoId =
      (typeof primeiroItem.produtoId === 'object' ? primeiroItem.produtoId._id : null) ||
      (typeof primeiroItem.produtoId === 'string' ? primeiroItem.produtoId : null) ||
      primeiroItem.produto?._id

    if (!produtoId) {
      throw new Error('ProdutoId não encontrado no item')
    }

    const response = await pedidoStore.reporEstoqueEPedido(pedido._id, produtoId)
    toast.success(response?.mensagem || '✅ Estoque reposto!')
    await pedidoStore.listarTodosPedidosSuperadmin()
  } catch (err) {
    toast.error(`❌ Erro ao repor estoque do pedido ${pedido?._id ?? '—'}: ${err.message}`)
  }
}

// --- CLP ---
async function iniciarProducao() {
  loadingProducao.value = true
  try {
    await clpService.iniciarProducao()
    toast.success('🚀 Produção iniciada!')
  } catch {
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
  } catch {
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
  } catch {
    toast.error('❌ Erro ao abortar pedido')
  } finally {
    loadingAbortar.value = false
  }
}

// --- Configurações ---
async function resetarCounters() {
  loadingCounters.value = true
  try {
    await fetch('/clp/reset-counters', { method: 'POST' })
    toast.success('⚙️ Counters resetados!')
  } catch {
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
  } catch {
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
  } catch {
    toast.error('❌ Erro ao recriar root')
  } finally {
    loadingAdminRoot.value = false
  }
}
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#005CA9] text-white flex flex-col p-4">
      <h2 class="text-xl font-bold mb-6">👑 SuperAdmin</h2>
      <nav class="flex flex-col gap-3">
        <button @click="irParaAdmins" class="text-left p-2 rounded" :class="abaAtiva==='admins' ? 'bg-blue-800' : 'hover:bg-blue-700'">
          📋 Admins
        </button>
        <button @click="irParaPedidos" class="text-left p-2 rounded" :class="abaAtiva==='pedidos' ? 'bg-blue-800' : 'hover:bg-blue-700'">
          🛒 Pedidos
        </button>
        <button @click="irParaProdutos" class="text-left p-2 rounded" :class="abaAtiva==='produtos' ? 'bg-blue-800' : 'hover:bg-blue-700'">
          📦 Produtos
        </button>
        <button @click="irParaConfiguracoes" class="text-left p-2 rounded" :class="abaAtiva==='configuracoes' ? 'bg-blue-800' : 'hover:bg-blue-700'">
          ⚙️ Configurações
        </button>
        <button @click="irParaEstoque" class="text-left p-2 rounded" :class="abaAtiva==='estoque' ? 'bg-blue-800' : 'hover:bg-blue-700'">
          📦 Estoque
        </button>
      </nav>
    </aside>

    <!-- Conteúdo principal -->
    <main class="flex-1 p-6 overflow-y-auto">
      <h1 class="text-3xl font-bold text-[#005CA9] mb-6">Painel do SuperAdmin</h1>

      <!-- Aba: Admins -->
      <section v-if="abaAtiva==='admins'" class="mb-10">
        <h2 class="text-xl font-semibold mb-4">Gerenciar Admins</h2>

        <!-- Formulário -->
        <form @submit.prevent="criarNovoAdmin" class="mb-6 flex gap-2">
          <input v-model="novoAdmin.nome" placeholder="Nome" class="border p-2 rounded w-1/4" autocomplete="name" />
          <input v-model="novoAdmin.email" type="email" placeholder="Email" class="border p-2 rounded w-1/3" autocomplete="email" />
          <input v-model="novoAdmin.senha" type="password" placeholder="Senha" class="border p-2 rounded w-1/4" autocomplete="new-password" />
          <button class="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2" 
                  :disabled="loadingCriar">
            <svg v-if="loadingCriar" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>{{ loadingCriar ? 'Criando...' : 'Criar Admin' }}</span>
          </button>
        </form>

        <!-- Lista -->
        <ul>
          <li v-for="admin in adminStore.admins" :key="admin._id" class="flex justify-between items-center border-b py-2">
            <span>{{ admin.nome }} — {{ admin.email }} ({{ admin.role }})</span>
            <div class="flex gap-2">
              <button @click="promoverUsuario(admin._id,'admin')" 
                      class="bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-2" 
                      :disabled="loadingPromover">
                <svg v-if="loadingPromover" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{{ loadingPromover ? 'Promovendo...' : '🔄 Tornar Admin' }}</span>
              </button>
              <button @click="promoverUsuario(admin._id, 'superadmin')" 
                      class="bg-green-600 text-white px-2 py-1 rounded flex items-center gap-2" 
                      :disabled="loadingPromover">
                <svg v-if="loadingPromover" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{{ loadingPromover ? 'Promovendo...' : '👑 Tornar SuperAdmin' }}</span>
              </button>

                <button @click="excluirAdmin(admin._id)" 
                      class="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-2" 
                      :disabled="loadingExcluir">
                <svg v-if="loadingExcluir" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{{ loadingExcluir ? 'Excluindo...' : '🗑️ Excluir' }}</span>
              </button>
            </div>
          </li>
        </ul>
      </section>

      <!-- Aba: Pedidos -->
      <section v-if="abaAtiva==='pedidos'" class="mb-10">
        <h2 class="text-xl font-semibold mb-4">Pedidos</h2>

        <!-- Ações rápidas -->
        <div class="flex gap-3 mb-4">
          <button @click="pedidoStore.listarTodosPedidosSuperadmin()" class="bg-blue-600 text-white px-4 py-2 rounded">
            🔄 Recarregar pedidos
          </button>
          <button @click="pedidoStore.excluirTodosPedidosSuperadmin()" class="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded">
            🛑 Excluir todos os pedidos
          </button>
        </div>

        <!-- Lista de pedidos -->
        <ul v-if="Array.isArray(pedidoStore.pedidos) && pedidoStore.pedidos.length">
          <li v-for="pedido in pedidoStore.pedidos" :key="pedido._id" class="border rounded p-3 mb-3 flex items-start justify-between">
            <div class="space-y-1">
              <div class="font-medium">
                <strong>#{{ pedido.numero || (pedido._id && pedido._id.slice ? pedido._id.slice(-6) : '—') }}</strong>
                — {{ pedidoStore.formatarStatus ? pedidoStore.formatarStatus(pedido.status) : pedido.status }}
              </div>
              <div class="text-sm text-gray-600">
                {{ (pedidoStore.formatarData ? pedidoStore.formatarData(pedido.dataCriacao || pedido.createdAt) : (pedido.dataCriacao || pedido.createdAt)) }}
                — Total: R$ {{ pedido.total }}
              </div>
              <div class="text-sm">
                <span class="font-semibold">Itens:</span>
                <span v-if="Array.isArray(pedido.itens)">
                  {{ pedido.itens.map(i => `${i.produtoId?.nome ?? 'Produto'} x${i.quantidade}`).join(', ') }}
                </span>
                <span v-else>—</span>
              </div>

              <!-- Botões de ação -->
              <div class="flex gap-2 mt-2">
                <button @click="liberarParaProducao(pedido._id)" 
                        class="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2" 
                        :disabled="loadingProducao">
                  <svg v-if="loadingProducao" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>{{ loadingProducao ? 'Liberando...' : '🚀 Liberar para produção' }}</span>
                </button>
                <button @click="pedidoStore.cancelarPedido(pedido._id)" 
                        class="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-2" 
                        :disabled="loadingAbortar">
                  <svg v-if="loadingAbortar" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>{{ loadingAbortar ? 'Cancelando...' : '🗑️ Cancelar' }}</span>
                </button>
                <button v-if="pedido.status === 'processando'" 
                        @click="reporEstoque(pedido)" 
                        class="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-2" 
                        :disabled="loadingCounters">
                  <svg v-if="loadingCounters" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>{{ loadingCounters ? 'Repondo...' : '🔄 Repor Estoque' }}</span>
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
      <section v-if="abaAtiva==='produtos'" class="mb-10">
        <h2 class="text-xl font-semibold mb-4">Produtos</h2>

        <button @click="produtoStore.listarProdutos()" class="bg-blue-600 text-white px-4 py-2 rounded mb-4">
          🔄 Recarregar produtos
        </button>

        <form @submit.prevent="produtoStore.cadastrarProduto({ nome: novoNome, preco: novoPreco })" class="flex gap-2 mb-6">
          <input v-model="novoNome" placeholder="Nome do produto" class="border p-2 rounded w-1/3" />
          <input v-model="novoPreco" type="number" placeholder="Preço" class="border p-2 rounded w-1/3" />
          <button class="bg-green-600 text-white px-4 py-2 rounded">➕ Adicionar</button>
        </form>

        <ul>
          <li v-for="produto in produtoStore.produtosOrdenados || produtoStore.produtos" :key="produto._id" class="border-b py-2 flex justify-between">
            <span>{{ produto.nome }} — R$ {{ produto.preco }} — {{ produto.status }}</span>
            <div class="flex gap-2">
              <button @click="produtoStore.atualizarStatusProduto(produto._id, 'ativo')" class="bg-blue-500 text-white px-2 py-1 rounded">
                ✅ Ativar
              </button>
              <button @click="produtoStore.atualizarStatusProduto(produto._id, 'inativo')" class="bg-yellow-500 text-white px-2 py-1 rounded">
                ⏸️ Inativar
              </button>
              <button @click="produtoStore.excluirProduto(produto._id)" class="bg-red-600 text-white px-2 py-1 rounded">
                🗑️ Excluir
              </button>
            </div>
          </li>
        </ul>
      </section>
      
      <!-- Aba: Configurações -->
      <section v-if="abaAtiva==='configuracoes'" class="mb-10">
        <h2 class="text-xl font-semibold mb-4">Configurações Globais</h2>
        <div class="flex flex-col gap-4">
          
          <!-- Resetar Counters -->
          <button @click="resetarCounters" 
                  class="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2" 
                  :disabled="loadingCounters">
            <svg v-if="loadingCounters" class="animate-spin h-4 w-4 text-blue-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>{{ loadingCounters ? 'Resetando...' : '⚙️ Resetar Counters' }}</span>
          </button>

          <!-- Garantir Produtos Base -->
          <button @click="garantirProdutosBase" 
                  class="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2" 
                  :disabled="loadingProdutosBase">
            <svg v-if="loadingProdutosBase" class="animate-spin h-4 w-4 text-green-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>{{ loadingProdutosBase ? 'Garantindo...' : '🍹 Garantir Produtos Base' }}</span>
          </button>

          <!-- Recriar SuperAdmin Root -->
          <button @click="recriarAdminRoot" 
                  class="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2" 
                  :disabled="loadingAdminRoot">
            <svg v-if="loadingAdminRoot" class="animate-spin h-4 w-4 text-purple-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>{{ loadingAdminRoot ? 'Recriando...' : '👑 Recriar SuperAdmin Root' }}</span>
          </button>
        </div>
        </section>

      <!-- 🔌 Controle do CLP (sempre visível) -->
      <section>
        <h2 class="text-xl font-semibold mb-4">Controle do CLP</h2>
        <div class="flex gap-4">
          
          <!-- Iniciar Produção -->
          <button @click="iniciarProducao" 
                  class="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2" 
                  :disabled="loadingProducao">
            <svg v-if="loadingProducao" class="animate-spin h-4 w-4 text-green-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>{{ loadingProducao ? 'Iniciando...' : '🚀 Iniciar Produção' }}</span>
          </button>

          <!-- Resetar PLC -->
          <button @click="resetPLC" 
                  class="bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2" 
                  :disabled="loadingReset">
            <svg v-if="loadingReset" class="animate-spin h-4 w-4 text-yellow-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>{{ loadingReset ? 'Resetando...' : '🔄 Resetar PLC' }}</span>
          </button>

          <!-- Abortar Pedido -->
          <button @click="abortarPedido" 
                  class="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2" 
                  :disabled="loadingAbortar">
            <svg v-if="loadingAbortar" class="animate-spin h-4 w-4 text-red-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>{{ loadingAbortar ? 'Abortando...' : '🛑 Abortar Pedido' }}</span>
          </button>

        </div>
      </section>

      <!-- Aba: Pedidos -->
      <section v-if="abaAtiva==='pedidos'" class="mb-10">
        <h2 class="text-xl font-semibold mb-4">Pedidos</h2>

        <div v-for="pedido in pedidos" :key="pedido._id" class="border p-3 rounded flex flex-col gap-2">
          <p><strong>ID:</strong> {{ pedido._id }}</p>
          <p><strong>Status:</strong> {{ pedido.status }}</p>
          <p><strong>Valor da compra:</strong> {{ formatCurrency(pedido.total) }}</p>


          <div class="flex gap-2">
            <button @click="liberarParaProducao(pedido._id)" class="bg-blue-600 text-white px-3 py-1 rounded" :disabled="loadingProducao">
              {{ loadingProducao ? 'Liberando...' : '🚀 Liberar' }}
            </button>

            <button @click="cancelarPedido(pedido._id)" class="bg-red-600 text-white px-3 py-1 rounded" :disabled="loadingAbortar">
              {{ loadingAbortar ? 'Cancelando...' : '🗑️ Cancelar' }}
            </button>

            <button v-if="pedido.status === 'processando'" @click="reporEstoque(pedido)" class="bg-green-600 text-white px-3 py-1 rounded" :disabled="loadingCounters">
              {{ loadingCounters ? 'Repondo...' : '🔄 Repor Estoque' }}
            </button>
          </div>
        </div>
      </section>

      <!-- Aba: Produtos -->
      <section v-if="abaAtiva==='produtos'" class="mb-10">
        <h2 class="text-xl font-semibold mb-4">Produtos</h2>
        <div class="flex flex-col gap-4">

          <!-- Criar Produto (fora do loop) -->
          <button @click="criarProduto" 
                  class="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-2" 
                  :disabled="loadingProduto">
            <span>{{ loadingProduto ? 'Criando...' : '➕ Criar Produto' }}</span>
          </button>

          <!-- Listagem de Produtos -->
          <div v-for="produto in produtos" :key="produto._id" class="flex flex-col gap-2">
            <p><strong>Nome:</strong> {{ produto.nome }}</p>
            <p><strong>Preço:</strong> {{ formatCurrency(produto.preco) }}</p>

            <!-- Excluir Produto -->
            <button @click="excluirProduto(produto._id)" 
                    class="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-2" 
                    :disabled="loadingProduto">
              <span>{{ loadingProduto ? 'Excluindo...' : '🗑️ Excluir Produto' }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Aba: Clientes -->
      <section v-if="abaAtiva==='clientes'" class="mb-10">
        <h2 class="text-xl font-semibold mb-4">Clientes</h2>
        <div class="flex flex-col gap-4">

          <!-- Criar Cliente (fora do loop) -->
          <button @click="criarCliente" 
                  class="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2" 
                  :disabled="loadingCliente">
            <span>{{ loadingCliente ? 'Criando...' : '➕ Criar Cliente' }}</span>
          </button>

          <!-- Listagem de Clientes -->
          <div v-for="cliente in clientes" :key="cliente._id" class="flex flex-col gap-2">
            <p><strong>Nome:</strong> {{ cliente.nome }}</p>
            <p><strong>Email:</strong> {{ cliente.email }}</p>

            <!-- Excluir Cliente -->
            <button @click="excluirCliente(cliente._id)" 
                    class="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-2" 
                    :disabled="loadingCliente">
              <span>{{ loadingCliente ? 'Excluindo...' : '🗑️ Excluir Cliente' }}</span>
            </button>
          </div>
        </div>
      </section>
    </main> 
  </div> 
</template>

