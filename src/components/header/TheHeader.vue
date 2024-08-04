<template>
    <nav v-if="!route.meta.hideHeader" class="navbar navbar-expand-lg my-1 sticky-top">
        <div class="container-fluid">
            <div class="navbar-brand">
                <router-link to="/" class="logo-link">
                    <div class="logo">Danger Lettuce</div>
                </router-link>
            </div>
            <button
                class="navbar-toggler border-0 px-1"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapsableContent"
                aria-controls="navbarCollapsableContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="text-light">
                    <FontAwesome icon="fa-bars" />
                </span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarCollapsableContent">
                <MainNavbar
                    @collapseNavbar="closeNavbar"
                />
            </div>
            
        </div>
    </nav>
</template>

<script setup lang="ts">

import MainNavbar from '@/components/header/MainNavbar.vue';
import { useRoute } from 'vue-router';
import { Collapse } from 'bootstrap';
const route = useRoute()

function closeNavbar() {
    const collapsableEle = document.getElementById('navbarCollapsableContent')
    if(collapsableEle?.classList.contains('show')) {
        const bsCollapse = new Collapse(collapsableEle)
        bsCollapse.toggle()
    }
}
</script>

<style scoped>
    nav {
        padding: 0 clamp(.3rem, 5vw, 20rem);
        background:var(--bs-body-bg);
    }
    .logo{
        font-weight: bold;
        font-size: clamp(1.25rem, 2.5vw, 2.5rem); 
        font-family: 'Carter One', cursive;
    }
    .logo-link {
        text-decoration: none;
        cursor: pointer;
    }
</style>