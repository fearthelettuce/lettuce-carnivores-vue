<template>
    <ul class="navbar-nav flex-row flex-wrap me-auto mb-2 mb-lg-0">
        <li class="nav-item" v-for="item of allowedNavLinks">
            <router-link
                :to="item.path"
                class="nav-link text-light"
            >{{ item.label }}</router-link>
        </li>

    </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {navData} from '@/router/index'
import { useUserStore } from '@/components/modules/auth/stores/users';

const userStore = useUserStore()
const allowedNavLinks = computed(() => {
    let allowedNavData = navData
    // if(!userStore.getIsAdmin) {
    //     allowedNavData = allowedNavData.filter((ele) => {return !ele.meta.requiresAdmin})
    // }
    // if(!userStore.getIsLoggedIn) {
    //     allowedNavData = allowedNavData.filter((ele) => {return !ele.meta.requiresLogin})
    // }
    return allowedNavData
})
</script>

<style scoped>

    .router-link-exact-active {
        border-radius: 0.4rem;
        background-color: #515151;
    }
    
    a {
        margin: 0 0.25rem;
    }

    a:hover {
        border-radius: 0.4rem;
        background-color: #515151;
    }
</style>