import { createRouter, createWebHistory } from 'vue-router'

// Importar as views (páginas)
import Produtos from '../views/Produtos.vue'
import Carrinho from '../views/Carrinho.vue'
import Login from '../views/Login.vue'
import Cadastro from '../views/Cadastro.vue'
import MeusPedidos from '../views/MeusPedidos.vue'
import Admin from '../views/Admin.vue'
import SuperAdmin from '../views/SuperAdmin.vue'
import NotFound from '../views/NotFound.vue' // Página 404

const clienteRoutes = [
  { path: '/', name: 'Produtos', component: Produtos },
  { path: '/carrinho', name: 'Carrinho', component: Carrinho },
  { path: '/login', name: 'Login', component: Login },
  { path: '/cadastro', name: 'Cadastro', component: Cadastro },
  { path: '/meus-pedidos', name: 'MeusPedidos', component: MeusPedidos }
]

const adminRoutes = [
  { path: '/admin', name: 'Admin', component: Admin },
  { path: '/superadmin', name: 'SuperAdmin', component: SuperAdmin }
]

const fallbackRoute = [
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const routes = [...clienteRoutes, ...adminRoutes, ...fallbackRoute]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Proteção de rota administrativa
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  console.log('Token:', token)
  console.log('User:', user)

  // Proteção para Admin
  if (to.name === 'Admin' && (!token || !['admin','superadmin'].includes(user.status))) {
    return next('/login')
  }

  // Proteção para SuperAdmin
  if (to.name === 'SuperAdmin' && (!token || user.status !== 'superadmin')) {
    return next('/login')
  }

  next()
})


export default router

