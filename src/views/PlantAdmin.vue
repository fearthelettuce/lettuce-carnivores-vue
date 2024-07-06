<template>
    <div class="contain plant-admin">
        <PlantAdmin />
    </div>
    


</template>

<script setup lang="ts">
import PlantAdmin from '@/components/modules/products/components/PlantAdmin.vue';
</script>

<style>
    @media(min-width: 62rem) {
        .plant-admin {
            margin: 0 2rem;
        }
    }
</style>