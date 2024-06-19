import { createRouter, createWebHistory, type RouteLocationRaw, type RouteComponet} from 'vue-router'
import { useUserStore } from '@/components/modules/auth/stores/users'
import HomeView from '@/views/HomeView.vue'
import ProductsView from '@/views/ProductsView.vue'
const ProductDetailView = () => import( '@/views/ProductDetailView.vue')
const ProductAdminView = () => import('@/components/modules/products/components/ProductAdmin.vue')
const AboutView = () => import('@/views/AboutView.vue')
const CareGuideView = () => import('@/views/CareGuideView.vue')
const RecommendationView = () => import( '@/views/RecommendationView.vue')
const LoginView  = () => import('@/views/LoginView.vue')
const ResetPasswordView  = () => import('@/views/ResetPasswordView.vue')
const EasterEggView  = () => import('@/views/EasterEggView.vue')
const AccountView = () => import('@/views/AccountView.vue')

export type NavItem = {
  path: RouteLocationRaw,
  name: String,
  label: String,
  component: RouteComponet,
  hasChildren?: boolean,
  children?: Array<NavItem>,
  props?: true,
  icon?: String,
  meta?: {
      showInNav: boolean,
      requiresLogin: boolean,
      requiresAdmin: boolean,
      requiresFamily?: boolean,
      hideHeader?: boolean,
  }
}

const routeData: Array<NavItem> = [
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
      path: "/shop",
      name: 'shop',
      label: 'Shop',
      props: true,
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
        showInNav: false,
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
      path: "/secret",
      name: 'secret',
      label: 'Secret',
      component: EasterEggView,
      meta: {
        showInNav: true,
        requiresLogin: true,
        requiresAdmin: false,
        requiresFamily: true,
      }
    },
    {
      path: "/account",
      name: 'account',
      label: 'Account',
      component: AccountView,
      meta: {
        showInNav: true,
        requiresLogin: true,
        requiresAdmin: false,
      }
    },
    {
      path: "/admin",
      name: 'Admin',
      label: 'Admin',
      component: ProductAdminView,
      meta: {
        showInNav: true,
        requiresLogin: true,
        requiresAdmin: true,
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
//Ignore ES Lint barfing an unused variable error, this line is specifically to exclude that variable from the exported object 
export const navData = routeData.map(({ component, ...rest }) => rest) //eslint-disable-line @typescript-eslint/no-unused-vars
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
