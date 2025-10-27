<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const pedidos = ref([])
const logs = ref([])

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const { data } = await axios.get('http://localhost:3000/pedidos', {
      headers: { Authorization: `Bearer ${token}` }
    })
    pedidos.value = data
  } catch (err) {
    console.error('Erro ao carregar pedidos', err)
  }
})

async function atualizarStatus(pedido, novoStatus) {
  try {
    const token = localStorage.getItem('token')
    await axios.put(
      `http://localhost:3000/pedidos/${pedido._id}`,
      { status: novoStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    pedido.status = novoStatus

    if (novoStatus === 'em_processamento') {
      logs.value.push(`Pedido #${pedido._id} enviado ao MES...`)
      setTimeout(async () => {
        await axios.put(
          `http://localhost:3000/pedidos/${pedido._id}`,
          { status: 'pronto' },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        pedido.status = 'pronto'
        logs.value.push(`Pedido #${pedido._id} atualizado para "Pronto" pelo MES`)
      }, 5000)
    }
  } catch (err) {
    console.error('Erro ao atualizar status', err)
  }
}
</script>
