import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/components/modules/auth/stores/users'
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
      meta: {
        requiresLogin: false,
        requiresAdmin: false,
      }
    },
    {
      path: "/products",
      name: 'products',
      label: 'Products',
      component: ProductsView,
      meta: {
        requiresLogin: false,
        requiresAdmin: false,
      }
    },
    {
      path: "/productadmin",
      name: 'productAdmin',
      label: 'Product Admin',
      component: ProductAdminView,
      meta: {
        requiresLogin: true,
        requiresAdmin: true,
      }
    },
    {
      path: "/blog",
      name: 'blog',
      label: 'Blog',
      component: BlogView,
      meta: {
        requiresLogin: false,
        requiresAdmin: false,
      }
    },
    {
      path: "/care",
      name: 'care',
      label: 'Care',
      component: CareGuideView,
      meta: {
        requiresLogin: false,
        requiresAdmin: false,
      }
    },
    {
      path: "/account",
      name: 'account',
      label: 'Account',
      component: LoginView,
      meta: {
        requiresLogin: true,
        requiresAdmin: false,
      }
    }
]

export const navData = routeData.map(({ component, ...rest }) => rest)
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeData,
})

router.beforeEach((to, from) => {
  const userStore = useUserStore()
  if(to.meta.requiresAdmin) {
    return userStore.getIsAdmin
  }

  if(to.meta.requiresLogin && !userStore.getIsLoggedIn && to.name !== 'home' && to.name !== 'account') {
    return {name: 'home'}
  }
})
