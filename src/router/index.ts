import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/components/modules/auth/stores/users'
import HomeView from '@/views/HomeView.vue'
import ProductsView from '@/views/ProductsView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import ProductAdminView from '@/components/modules/products/components/ProductAdmin.vue'
import AboutView from '@/views/AboutView.vue'
import CareGuideView from '@/views/CareGuideView.vue'
import RecommendationView from '@/views/RecommendationView.vue'
import LoginView from '@/views/LoginView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'


const routeData = [
    {
      path: "/",
      name: 'home',
      label: 'Home',
      component: HomeView,
      meta: {
        showInNav: false,
        requiresLogin: false,
        requiresAdmin: false,
        hideHeader: true,
      }
    },
    {
      path: "/products",
      name: 'products',
      label: 'Products',
      component: ProductsView,
      meta: {
        showInNav: true,
        requiresLogin: false,
        requiresAdmin: false,
      }
    },
    {
      path: "/products/:id",
      name: 'productDetails',
      label: 'Products Details',
      component: ProductDetailView,
      meta: {
        showInNav: false,
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
        showInNav: true,
        requiresLogin: true,
        requiresAdmin: true,
      }
    },
    {
      path: "/care",
      name: 'care',
      label: 'Care',
      component: CareGuideView,
      meta: {
        showInNav: true,
        requiresLogin: false,
        requiresAdmin: false,
      }
    },
    {
      path: "/recommendations",
      name: 'recommendations',
      label: 'Recommendations',
      component: RecommendationView,
      meta: {
        showInNav: true,
        requiresLogin: false,
        requiresAdmin: false,
      }
    },
    {
      path: "/about",
      name: 'about',
      label: 'About',
      component: AboutView,
      meta: {
        showInNav: true,
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
        showInNav: true,
        requiresLogin: true,
        requiresAdmin: false,
      }
    },
    {
      path: "/login",
      name: 'login',
      label: 'Login',
      component: LoginView,
      meta: {
        showInNav: false,
        requiresLogin: true,
        requiresAdmin: false,
      }
    },
    {
      path: "/resetpassword",
      name: 'resetPassowrd',
      label: 'Reset Password',
      component: ResetPasswordView,
      meta: {
        showInNav: false,
        requiresLogin: false,
        requiresAdmin: false,
      }
    }
]

export const navData = routeData.map(({ component, ...rest }) => rest)
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeData,
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  if(to.meta.requiresAdmin) {
    return userStore.isAdmin
  }

  if(to.meta.requiresLogin && !userStore.isLoggedIn && to.name !== 'home' && to.name !== 'login') {
    return {name: 'home'}
  }
})
