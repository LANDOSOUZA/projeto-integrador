import { createRouter, createWebHistory } from 'vue-router'

// Importar as views (páginas)
import Produtos from '../views/Produtos.vue'
import Carrinho from '../views/Carrinho.vue'
import LoginCadastro from '../views/LoginCadastro.vue'
import MeusPedidos from '../views/MeusPedidos.vue'
import Admin from '../views/Admin.vue'
import NotFound from '../views/NotFound.vue' // Página 404

const clienteRoutes = [
  { path: '/', name: 'Produtos', component: Produtos },
  { path: '/carrinho', name: 'Carrinho', component: Carrinho },
  { path: '/login', name: 'LoginCadastro', component: LoginCadastro },
  { path: '/meus-pedidos', name: 'MeusPedidos', component: MeusPedidos }
]

const adminRoutes = [
  { path: '/admin', name: 'Admin', component: Admin }
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

  if (to.name === 'Admin' && (!token || user.status !== 'admin')) {
    next('/login')
  } else {
    next()
  }
})

export default router

