<template>
  <header class="w-full z-40 fixed top-0 left-0 bg-background">
    <div class="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
      <div class="justify-start items-center gap-4 lg:flex hidden flex-row">
        <NavigationMenu class="flex justify-between items-start">
          <NavigationMenuList class="flex justify-start gap-4 flex-row">

              <NavigationMenuItem v-for="item in allowedNavLinks" :key="item.name">
                <NavigationMenuLink @click="collapseNavbar">
                  <Button variant="ghost">
                    
                    <router-link :to="item.path" class="nav-link text-light"
                    @click="$emit('collapseNavbar')">{{ item.label }}</router-link>
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
          </NavigationMenuList>
          
        </NavigationMenu>
      </div>
      <Sheet>
        <SheetTrigger >Open</SheetTrigger>
        <SheetContent side="top">
          <div v-for="item in allowedNavLinks" :key="item.name">
            <router-link :to="item.path" class="nav-link text-light" @click="$emit('collapseNavbar')">{{ item.label }}</router-link>
          </div>
        </SheetContent>
      </Sheet>
    </div>

  </header>
</template>

<script setup lang='ts'>
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from '@/components/ui/button'
import { computed } from 'vue';
import { navData } from '@/router/index'
import { useUserStore } from '@/stores/users';
import { useOrderStore } from '@/stores/order';
import { storeToRefs } from 'pinia'

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
const emit = defineEmits(['collapseNavbar'])
function collapseNavbar() {
  console.log('Collapse? How?')
}
function handleLogout() {
  userStore.logoutUser()
  emit('collapseNavbar', {})
}

</script>

<style scoped lang='scss'>
header {
  width: 100%;
}
</style>