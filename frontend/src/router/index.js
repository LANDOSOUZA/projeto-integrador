import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

// Importar componentes
import Produtos from '../views/Produtos.vue'   // ⚡ adicionar aqui
import Carrinho from '../views/Carrinho.vue'
import MeusPedidos from '../views/MeusPedidos.vue'
import Login from '../views/Login.vue'
import AdminPrincipal from '../views/Admin.vue'
import SuperAdminPrincipal from '../views/SuperAdmin.vue'
import Cadastro from '../views/Cadastro.vue'


const routes = [
  { path: '/', component: Produtos },
  { path: '/produtos', component: Produtos },
  { path: '/carrinho', component: Carrinho, meta: { requiresAuth: true } },
  { path: '/meus-pedidos', component: MeusPedidos, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/cadastro', component: Cadastro },   // ✅ rota adicionada
  { path: '/admin', component: AdminPrincipal, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/superadmin', component: SuperAdminPrincipal, meta: { requiresAuth: true, role: 'superadmin' } }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔒 Guard global de autenticação e roles
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 1. Se rota exige login e usuário não está autenticado
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return next('/login')
  }

  // 2. Se rota exige role específica
  if (to.meta.role === 'admin' && !userStore.isAdmin) {
    return next('/login')
  }
  if (to.meta.role === 'superadmin' && !userStore.isSuperAdmin) {
    return next('/login')
  }

  // 3. Se já está logado e tenta acessar /login
  if (to.path === '/login' && userStore.isAuthenticated) {
    if (userStore.isAdmin) return next('/admin')
    if (userStore.isSuperAdmin) return next('/superadmin')
    return next('/produtos')
  }

  // 4. Caso contrário, segue normalmente
  next()
})

export default router