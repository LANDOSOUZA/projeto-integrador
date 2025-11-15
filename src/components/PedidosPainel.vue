<script setup>
import { ref, onMounted } from 'vue'
import { usePedidosStore } from '../stores/pedidos'

const pedidoStore = usePedidosStore()
const logs = ref([])
const erro = ref('')

async function carregarPedidos() {
  try {
    await pedidoStore.listarTodosPedidosAdmin()
    logs.value.push(`Carregados ${pedidoStore.pedidos.length} pedidos`)
  } catch (err) {
    erro.value = 'Erro ao carregar pedidos'
  }
}

async function anteciparPedido(id) {
  try {
    const status = await pedidoStore.anteciparPedido(id)
    logs.value.push(`Pedido ${id} antecipado para "${status}"`)
    // opcional: atualizar apenas o pedido no estado em vez de recarregar tudo
    await carregarPedidos()
  } catch {
    logs.value.push(`Erro ao antecipar pedido ${id}`)
  }
}

async function cancelarPedido(id) {
  try {
    const status = await pedidoStore.cancelarPedido(id)
    logs.value.push(`Pedido ${id} cancelado — novo status: "${status}"`)
    await carregarPedidos()
  } catch {
    logs.value.push(`Erro ao cancelar pedido ${id}`)
  }
}

async function excluirPedidosCliente(codigoCliente) {
  if (!confirm('Tem certeza que deseja excluir todos os pedidos deste cliente?')) return
  try {
    await pedidoStore.excluirPedidosClienteAdmin(codigoCliente)
    logs.value.push(`Pedidos do cliente ${codigoCliente} excluídos`)
    await carregarPedidos()
  } catch {
    logs.value.push(`Erro ao excluir pedidos do cliente ${codigoCliente}`)
  }
}

async function limparPedidos() {
  if (!confirm('Tem certeza que deseja limpar TODOS os pedidos?')) return
  try {
    await pedidoStore.limparPedidos()
    logs.value.push('Todos os pedidos foram removidos')
    await carregarPedidos()
  } catch {
    logs.value.push('Erro ao limpar pedidos')
  }
}

function getEmoji(nomeProduto) {
  const mapa = { laranja: '🍊', uva: '🍇', abacaxi: '🍍' }
  return mapa[nomeProduto] || '🥤'
}

onMounted(() => carregarPedidos())
</script>
