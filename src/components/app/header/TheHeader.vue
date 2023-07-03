<template>
    <header class="navbar navbar-expand-xl">
            <nav class="container" aria-label="Main navigation">
                <button
                    class="navbar-toggler border-0"
                    type="button"
                    data-toggle="collapse"
                    data-target="navbarSupportedContent"
                    @click="underConstruction"
                >
                <span class="text-light">
                        <FontAwesome icon="fa-bars" />
                    </span>
                </button>
                <div class="collapse navbar-collapse">
                    <div class="navbar-brand">
                        <router-link to="/" class="logo-link">
                            <!-- <img
                                class="brand-logo"
                                alt="Site logo"
                                src="@/assets/images/brand-logo.png"
                            > -->
                            <div class="logo">Lettuce Carnivorus Plants</div>
                        </router-link>
                    </div>
                    <MainNavbar />
                </div>
                <button 
                    v-if="!userStore.isLoggedIn"
                    type="button"
                    class="btn btn-secondary"
                    @click="router.push('/account')"
                    >
                    Login
                </button>
                <button 
                    type="button"
                    class="btn btn-secondary"
                    @click="userStore.logoutUser"
                    v-else>
                    Logout
                </button>
            </nav>
            
    </header>

</template>

<script setup lang="ts">

import MainNavbar from './MainNavbar.vue';
import { useUserStore } from '@/components/modules/auth/stores/users'
import { router } from '@/router/index'
const userStore = useUserStore()

function underConstruction() {
    alert('This feature has not been fully implemented yet!')
}

</script>

<style scoped>
    .logo{
        font-weight: bold;
        font-size: 2rem;
        font-family: 'Carter One', cursive;
    }

    .logo-link {
        text-decoration: none;
        cursor: pointer;
    }
</style>