import { createRouter, createWebHistory } from 'vue-router'

// Importar as views (páginas)
import Produtos from '../views/Produtos.vue'
import Carrinho from '../views/Carrinho.vue'
import LoginCadastro from '../views/LoginCadastro.vue'
import MeusPedidos from '../views/MeusPedidos.vue'
import Admin from '../views/Admin.vue'

const routes = [
  {
    path: '/',
    name: 'Produtos',
    component: Produtos
  },
  {
    path: '/carrinho',
    name: 'Carrinho',
    component: Carrinho
  },
  {
    path: '/login',
    name: 'LoginCadastro',
    component: LoginCadastro
  },
  {
    path: '/meus-pedidos',
    name: 'MeusPedidos',
    component: MeusPedidos
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
