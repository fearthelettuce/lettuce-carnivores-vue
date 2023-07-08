<template>
    <header v-if="!route.meta.hideHeader" class="navbar navbar-expand-lg my-1 sticky-top">
            <nav class="container-fluid">
                <div class="navbar-brand">
                    <router-link to="/" class="logo-link">
                        <div class="logo">Lettuce Carnivorus Plants</div>
                    </router-link>
                </div>
                <button
                    class="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarCollapsableContent"
                >
                    <span class="text-light">
                        <FontAwesome icon="fa-bars" />
                    </span>
                </button>
                
                <div class="collapse navbar-collapse" id="navbarCollapsableContent">
                    <MainNavbar />
                </div>
            </nav>
    </header>
</template>

<script setup lang="ts">

import MainNavbar from './MainNavbar.vue';
import { useRoute } from 'vue-router';
const route = useRoute()

</script>

<style scoped>
    header {
        padding: 0 1rem;
        background: #383838
    }
    .logo{
        font-weight: bold;
        font-size: 1.25rem;
        font-family: 'Carter One', cursive;
    }

    .logo-link {
        text-decoration: none;
        cursor: pointer;
    }
    @media (min-width: 1400px) {
        .logo{     
            font-size: 2rem;
        }
        header {
            padding: 0 12rem;
        }
    }
</style>