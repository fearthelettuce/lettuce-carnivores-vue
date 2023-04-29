<template>
    <header class="navbar navbar-expand-xl bg-dark sticky-top">
            <nav class="container" aria-label="Main navigation">
                <button
                    class="navbar-toggler border-0"
                    type="button"
                    data-toggle="collapse"
                    data-target="navbarSupportedContent"
                    @click="underConstruction"
                >
                <span class="text-light">
                        <fa icon="fa-bars" />
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
                            <div class="logo">Fear the Lettuce</div>
                        </router-link>
                    </div>
                    <MainNavbar />
                </div>
                
                <button 
                    type="button"
                    class="btn btn-secondary"
                    @click="underConstruction()">
                    Login
                </button>
            </nav>
            
    </header>

</template>

<script setup lang="ts">

import MainNavbar from './MainNavbar.vue';

function underConstruction() {
    alert('This feature has not been fully implemented yet!')
}

</script>

<style scoped>
    .logo{
        font-weight: bold;
        font-size: 2rem;
        color: rgb(103, 202, 37);
    }

    .logo-link {
        text-decoration: none;
        cursor: pointer;
    }
</style>