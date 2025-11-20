// 📂 src/views/clpPainel.vue
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useClpStore } from '../stores/clp'
import { useToast } from 'vue-toastification'

const clpStore = useClpStore()
const toast = useToast()
let intervalId = null

onMounted(() => {
  // Carrega status inicial
  clpStore.lerStatus().catch(err => {
    toast.error(`❌ Erro ao carregar status inicial: ${err.message}`)
  })

  // Atualiza a cada 2 segundos
  intervalId = setInterval(async () => {
    try {
      await clpStore.lerStatus()
    } catch (err) {
      toast.error(`❌ Erro ao atualizar status: ${err.message}`)
    }
  }, 2000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>
