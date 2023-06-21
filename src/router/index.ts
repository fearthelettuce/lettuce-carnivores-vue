import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProductsView from '@/views/ProductsView.vue'
import ProductAdminView from '@/components/modules/products/components/ProductAdmin.vue'
import BlogView from '@/views/BlogView.vue'
import CareGuideView from '@/views/CareGuideView.vue'
import LoginView from '@/views/LoginView.vue'
const routeData = [
    {
      path: "/",
      name: 'home',
      label: 'Home',
      component: HomeView,
      requiresLogin: false,
      requiresAdmin: false,
    },
    {
      path: "/products",
      name: 'products',
      label: 'Products',
      component: ProductsView,
      requiresLogin: false,
      requiresAdmin: false,
    },
    {
      path: "/productadmin",
      name: 'productAdmin',
      label: 'Product Admin',
      component: ProductAdminView,
      requiresLogin: true,
      requiresAdmin: true,
    },
    {
      path: "/blog",
      name: 'blog',
      label: 'Blog',
      component: BlogView,
      requiresLogin: false,
      requiresAdmin: false,
    },
    {
      path: "/care",
      name: 'care',
      label: 'Care',
      component: CareGuideView,
      requiresLogin: false,
      requiresAdmin: false,
    },
    {
      path: "/account",
      name: 'account',
      label: 'Account',
      component: LoginView,
      requiresLogin: true,
      requiresAdmin: false,
    }
]

export const navData = routeData.map(({ component, ...rest }) => rest)
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeData,
})
