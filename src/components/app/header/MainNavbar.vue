<template>
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item" v-for="item of allowedNavLinks" :key="item.name">
            <router-link
                :to="item.path"
                class="nav-link text-light"
                @click="$emit('collapseNavbar')"
            >{{ item.label }}</router-link>
        </li>
        <li class="nav-item">
            <router-link
                v-if="!userStore.isLoggedIn"
                to="/login"
                class="nav-link text-light"
                @click="$emit('collapseNavbar')"
            >Login</router-link>
            <div v-else class="nav-link text-light p-0">
                <button
                    to="/login"
                    type="button"
                    class="nav-link text-light"
                    @click="handleLogout"
                >Logout</button>
            </div>
            
        </li>
    </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { navData } from '@/router/index'
import { useUserStore } from '@/components/modules/auth/stores/users';

// const emit = defineEmits(['closeNavbar'])
const userStore = useUserStore()
const allowedNavLinks = computed(() => {
    let allowedNavData = navData.filter((ele) => {return ele.meta.showInNav})
    if(!userStore.isFamily) {
        allowedNavData = allowedNavData.filter((ele) => {return !ele.meta.requiresFamily})
    }
    if(!userStore.isAdmin) {
        allowedNavData = allowedNavData.filter((ele) => {return !ele.meta.requiresAdmin})
    }
    if(!userStore.isLoggedIn) {
        allowedNavData = allowedNavData.filter((ele) => {return !ele.meta.requiresLogin})
    }
    return allowedNavData
})
const emit = defineEmits(['collapseNavbar'])
function handleLogout() {
    userStore.logoutUser()
    emit('collapseNavbar',{})
}
</script>

<style scoped>

    .router-link-exact-active {
        border-radius: 0.4rem;
        color: rgb(159, 219, 80)!important
    }
    li {
        margin: 0 .25em;
        font-size: 1.5rem;
    }
    .nav-link:hover {
        border-radius: 0.4rem;
        background-color: #515151;
    }
</style>