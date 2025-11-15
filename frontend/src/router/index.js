import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

// Importar componentes
import Carrinho from '../views/Carrinho.vue'
import MeusPedidos from '../views/MeusPedidos.vue'
import Login from '../views/Login.vue'
import AdminPrincipal from '../views/Admin.vue'
import SuperAdminPrincipal from '../views/SuperAdmin.vue'

const routes = [
  { path: '/', component: MeusPedidos }, // 👈 página inicial agora é MeusPedidos
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

  // Se rota é /admin → precisa ser admin ou superadmin
  if (to.path.startsWith('/admin') && !userStore.isAdmin) {
    return next('/login')
  }

  // Se rota é /superadmin → precisa ser superadmin
  if (to.path.startsWith('/superadmin') && !userStore.isSuperAdmin) {
    return next('/login')
  }

  // Se rota é protegida e não autenticado → redireciona
  if ((to.path.startsWith('/admin') || to.path.startsWith('/superadmin')) && !userStore.isAuthenticated) {
    return next('/login')
  }

  next()
})

export default router
