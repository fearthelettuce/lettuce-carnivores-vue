<template>
    <ul class="navbar-nav flex-row flex-wrap me-auto mb-2 mb-lg-0">
        <li class="nav-item" v-for="item of navData">
            <router-link
                :to="item.path"
                class="nav-link text-light"
            >{{ item.label }}</router-link>
        </li>

    </ul>
</template>

<script setup lang="ts">

import {navData} from '@/router/index'

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