<template>
  <header class="w-full sticky z-50 top-0 py-2 bg-background">
    <div class="header-container">
      <Button class="hamburger-icon-container" variant="ghost" @click="toggleMobileMenu">
        <HamburgerButton :isOpen />
      </Button>
    
      <div class="logo text-lime-500 dark:text-lime-600">
        <router-link to="/">Danger Lettuce</router-link>
      </div>

      <div class="flex flex-row justify-end">

        <div class="flex flex-row align-center gap-4">
          <router-link to="/login" v-if="!userStore.isLoggedIn">
            <Button variant="default" @click="closeMobileMenu" class="loginButton">Login</Button>
          </router-link>
          <div class="right-container">
            <!-- <Button variant="ghost">Updates</Button> -->

            <div class="cart" @click="closeMobileMenu">
              <router-link to="/cart">
                <div>
                  <div class="cart-container">
                    <svg class="icon" stroke-width="1.5" viewBox="0 0 24 24" fill="none"
                      xmlns="http://www.w3.org/2000/svg" color="#000000">
                      <path
                        d="M19.5 22C20.3284 22 21 21.3284 21 20.5C21 19.6716 20.3284 19 19.5 19C18.6716 19 18 19.6716 18 20.5C18 21.3284 18.6716 22 19.5 22Z"
                        fill="#000000" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      </path>
                      <path
                        d="M9.5 22C10.3284 22 11 21.3284 11 20.5C11 19.6716 10.3284 19 9.5 19C8.67157 19 8 19.6716 8 20.5C8 21.3284 8.67157 22 9.5 22Z"
                        fill="#000000" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      </path>
                      <path d="M5 4H22L20 15H7L5 4ZM5 4C4.83333 3.33333 4 2 2 2" stroke="#000000" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M20 15H7H5.23077C3.44646 15 2.5 15.7812 2.5 17C2.5 18.2188 3.44646 19 5.23077 19H19.5"
                        stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span
                      class="absolute -top-1 -right-2 translate-middle w-5 h-5 leading-normal rounded-full flex justify-center items-center rounded-full bg-red-600 text-white">{{ cartItemCount }}</span>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <nav class="justify-start items-center gap-4">
          <Sheet v-model:open="isOpen">
            <SheetContent side="left" class="mobile-menu-sheet p-0 bg-background border-none">
              <div class="mobile-menu">
                <div v-for="item in allowedNavLinks" :key="item.name" class="mobile-nav-link">
                  <Button variant="ghost" class="p-6 text-xl">
                    <router-link :to="item.path" @click="closeMobileMenu">{{ item.label }}</router-link>
                  </Button>
                </div>
                <div>
                  <router-link to="/login" v-if="!userStore.isLoggedIn">
                    <Button variant="ghost" @click="closeMobileMenu" class="p-6 text-xl">Login</Button>
                  </router-link>
                  <Button v-else variant="outline" @click="handleLogout" class="p-6 text-xl">Logout</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang='ts'>
import { type Ref } from 'vue'
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import { computed } from 'vue';
import { navData } from '@/router/index'
import { useUserStore } from '@/stores/users';
import { useOrderStore } from '@/stores/order';
import { storeToRefs } from 'pinia'
import HamburgerButton from './HamburgerButton.vue'

//https://www.twblocks.com/blocks/headers/header1
//https://github.com/shadcn-ui/ui/issues/761

const { cartItemCount } = storeToRefs(useOrderStore())

const userStore = useUserStore()
const allowedNavLinks = computed(() => {
  let allowedNavData = navData.filter((ele) => { return ele.meta.showInNav })
  if (!userStore.isFamily) {
    allowedNavData = allowedNavData.filter((ele) => { return !ele.meta.requiresFamily })
  }
  if (!userStore.isAdmin) {
    allowedNavData = allowedNavData.filter((ele) => { return !ele.meta.requiresAdmin })
  }
  if (!userStore.isLoggedIn) {
    allowedNavData = allowedNavData.filter((ele) => { return !ele.meta.requiresLogin })
  }
  return allowedNavData
})
const isOpen: Ref<boolean> = defineModel({ default: false })
function toggleMobileMenu() {
  isOpen.value = !isOpen.value
}
function closeMobileMenu() {
  isOpen.value = false
}
function handleLogout() {
  userStore.logoutUser()
  isOpen.value = false
}

</script>

<style scoped lang='scss'>
header {
  width: 100%;
}

.header-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  flex-direction: row;
  justify-content: space-between;
  border: 2px solid black;
  border-radius: 3rem;
  padding-block: .3rem;
  padding-inline: 1.25rem;
  margin: auto;
  align-items: center;

}

.logo {
  font-weight: bold;
  font-size: clamp(1.2rem, 2.5vw, 2.75rem);
  font-family: 'Carter One', cursive;
}

.logo-link {
  text-decoration: none;
  cursor: pointer;
}

.right-container {
  display: flex;
  flex-direction: row;
}

.nav-menu {
  display: none;
  flex-direction: row;
  justify-content: space-evenly;
}

.loginButton {
  display: none;
}

.mobile-menu {
  display: flex;
  flex-direction: column;
  gap: .5rem;
}

.mobile-menu-sheet {
  background-color: red;
}

.mobile-menu:first-child {
  margin-top: 2rem;
}

.mobile-menu>* {
  margin-block: .5rem;
}

.mobile-nav-link {
  font-size: 1.5rem;
}

.hamburger-icon-container {
  display: block;
}

.shop-button {
  display: none;
}

.router-link-exact-active.nav-link {
  border-radius: 0.4rem;
  text-decoration-color: #9fdb50 !important;
  text-decoration: underline;
  text-underline-offset: .5rem;
  text-decoration-thickness: .3rem;
}

.cart {
  align-items: center;
  justify-content: center;
}

.cart-container {
  position: relative;
  max-width: 2rem;
}

.icon {
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-self: center;
  margin: 0;
  filter: invert(100%) sepia(1%) saturate(2215%) hue-rotate(175deg) brightness(7%) contrast(102%);
}
@media(min-width: 400px) {
  .header-container {
    padding-block: .55rem;
    padding-inline: 1.2rem;
    grid-template-columns: 1fr 2fr 1fr;
  }
}

@media(min-width: 600px) {
  .header-container {
    padding-block: 0.1rem;
    padding-inline: 2.5rem;
  }
  .logo {
    font-size: clamp(1.75rem, 3vw, 2.75rem);
  }
}
</style>