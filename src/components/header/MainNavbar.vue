<template>
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item" v-for="item of allowedNavLinks" :key="item.name">
            <router-link
                :to="item.path"
                class="nav-link textlight"
                @click="$emit('collapseNavbar')"
            >{{ item.label }}</router-link>
        </li>
        <li class="nav-item">
            <router-link
                v-if="!userStore.isLoggedIn"
                to="/login"
                class="nav-link textlight"
                @click="$emit('collapseNavbar')"
            >Login</router-link>
            <div v-else class="nav-link textlight p-0">
                <button
                    to="/login"
                    type="button"
                    class="nav-link textlight"
                    @click="handleLogout"
                >Logout</button>
            </div>
        </li>
        
    </ul>
    <div class="cart">
            <router-link
                to="/cart"
                @click="$emit('collapseNavbar')"
            >
                <div>
                    <div class="cart-container">
                        <svg class="icon" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M19.5 22C20.3284 22 21 21.3284 21 20.5C21 19.6716 20.3284 19 19.5 19C18.6716 19 18 19.6716 18 20.5C18 21.3284 18.6716 22 19.5 22Z" fill="#000000" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.5 22C10.3284 22 11 21.3284 11 20.5C11 19.6716 10.3284 19 9.5 19C8.67157 19 8 19.6716 8 20.5C8 21.3284 8.67157 22 9.5 22Z" fill="#000000" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 4H22L20 15H7L5 4ZM5 4C4.83333 3.33333 4 2 2 2" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20 15H7H5.23077C3.44646 15 2.5 15.7812 2.5 17C2.5 18.2188 3.44646 19 5.23077 19H19.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{{ `${cartItemCount}` }}</span>
                    </div>
                </div>
            </router-link>
        </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { navData } from '@/router/index'
import { useUserStore } from '@/stores/users';
import { useOrderStore } from '@/stores/order';
import { storeToRefs } from 'pinia'

const { cartItemCount } = storeToRefs(useOrderStore())

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

    .cart {
        margin-right: 15dvw;
        margin-left: 0.375rem;
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
        filter: invert(100%) sepia(1%) saturate(2215%) hue-rotate(175deg) brightness(97%) contrast(102%);

    }

</style>