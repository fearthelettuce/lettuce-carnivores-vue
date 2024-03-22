<template>
    <li v-if="!navItem.hasChildren">
        <router-link :to="navItem.path" 
            @click="$emit('collapseNavbar')"
            class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0 dark:text-white md:dark:hover:text-primary-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
            {{ navItem.label }}
        </router-link>
    </li>

    <li v-else>
        <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar" class="flex items-center justify-between w-full py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-primary-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent">Dropdown <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
        </svg></button>
        <!-- Dropdown menu -->
        <div id="dropdownNavbar" class="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
                <li v-for="child in navItem.children">
                    <router-link :to="child.path" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{{ child.label }}</router-link>
                </li>
            </ul>
        </div>
    </li>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type {NavItem} from '@/router/index'
//TODO: Add option for icon before label

const props = defineProps({
    navItem: {
        type: Object as PropType<NavItem>,
        required: true,
        }
})
</script>

<style scoped>
    .router-link-exact-active {
        border-radius: 0.4rem;
        color: rgb(159, 219, 80)!important
    }
</style>