import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProductsView from '@/views/ProductsView.vue'
import ProductFormView from '@/views/ProductFormView.vue'
import CartView from '@/views/CartView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: HomeView,
    meta: { titulo: 'Inicio' }
  },
  {
    path: '/productos',
    name: 'productos',
    component: ProductsView,
    meta: { titulo: 'Productos' }
  },
  {
    path: '/productos/crear',
    name: 'producto-crear',
    component: ProductFormView,
    meta: { titulo: 'Crear producto' }
  },
  {
    path: '/productos/:id',
    name: 'producto-editar',
    component: ProductFormView,
    props: true,
    meta: { titulo: 'Editar producto' }
  },
  {
    path: '/carrito',
    name: 'carrito',
    component: CartView,
    meta: { titulo: 'Carrito' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'no-encontrada',
    component: NotFoundView,
    meta: { titulo: 'Página no encontrada' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

router.afterEach((to) => {
  document.title = `Nova Store · ${to.meta.titulo || 'Tienda'}`
})

export default router
