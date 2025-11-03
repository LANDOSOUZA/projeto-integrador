<script setup>
import { useRouter } from 'vue-router'
import { useCarrinhoStore } from '../stores/carrinho'
import { api } from '../services/api'

const carrinhoStore = useCarrinhoStore()
const router = useRouter()

function aumentar(item) {
  carrinhoStore.adicionar(item)
}

function diminuir(item) {
  carrinhoStore.remover(item.id)
}

async function finalizarCompra() {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Você precisa estar logado para finalizar a compra.')
      router.push('/login')
      return
    }

    // monta itens no formato do backend
    const itens = carrinhoStore.itens.map(i => ({
      produtoId: i._id,       // 👈 usa o _id do produto
      quantidade: i.quantidade
    }))

    const total = itens.reduce((soma, i) => soma + i.quantidade, 0)
    if (total < 1 || total > 3) {
      alert('Você deve pedir entre 1 e 3 sucos por pedido.')
      return
    }

    const { data } = await api.post('/pedido', { itens }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    console.log('🧃 Pedido criado:', data.pedido)
    alert(`Pedido #${data.pedido.codigoCliente} criado com sucesso!`)

    carrinhoStore.limpar()
    router.push('/meus-pedidos')
  } catch (err) {
    console.error('Erro ao finalizar pedido:', err)
    alert(err.response?.data?.mensagem || 'Erro ao finalizar pedido')
  }
}
</script>
