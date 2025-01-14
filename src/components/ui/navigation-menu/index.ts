import { cva } from 'class-variance-authority'

export { default as NavigationMenu } from './NavigationMenu.vue'
export { default as NavigationMenuContent } from './NavigationMenuContent.vue'
export { default as NavigationMenuItem } from './NavigationMenuItem.vue'
export { default as NavigationMenuLink } from './NavigationMenuLink.vue'
export { default as NavigationMenuList } from './NavigationMenuList.vue'
export { default as NavigationMenuTrigger } from './NavigationMenuTrigger.vue'
export { default as NavigationMenuViewport } from './NavigationMenuViewport.vue'

export const navigationMenuTriggerStyle = cva(
  'group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-stone-100 hover:text-stone-900 focus:bg-stone-100 focus:text-stone-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-stone-100/50 data-[state=open]:bg-stone-100/50 dark:bg-stone-950 dark:hover:bg-stone-800 dark:hover:text-stone-50 dark:focus:bg-stone-800 dark:focus:text-stone-50 dark:data-[active]:bg-stone-800/50 dark:data-[state=open]:bg-stone-800/50',
)
