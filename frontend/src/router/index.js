import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

// Importar componentes
import Produtos from '../views/Produtos.vue'   // ⚡ adicionar aqui
import Carrinho from '../views/Carrinho.vue'
import MeusPedidos from '../views/MeusPedidos.vue'
import Login from '../views/Login.vue'
import AdminPrincipal from '../views/Admin.vue'
import SuperAdminPrincipal from '../views/SuperAdmin.vue'

const routes = [
  { path: '/', component: Produtos },          // ✅ agora a página inicial é Produtos
  { path: '/produtos', component: Produtos },  // opcional: rota explícita para Loja
  { path: '/carrinho', component: Carrinho },
  { path: '/meus-pedidos', component: MeusPedidos },
  { path: '/login', component: Login },

  // Rotas protegidas
  { path: '/admin', component: AdminPrincipal },
  { path: '/superadmin', component: SuperAdminPrincipal }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔒 Guard global de autenticação e roles
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.path.startsWith('/admin') && !userStore.isAdmin) {
    return next('/login')
  }

  if (to.path.startsWith('/superadmin') && !userStore.isSuperAdmin) {
    return next('/login')
  }

  if ((to.path.startsWith('/admin') || to.path.startsWith('/superadmin')) && !userStore.isAuthenticated) {
    return next('/login')
  }

  next()
})

export default router

