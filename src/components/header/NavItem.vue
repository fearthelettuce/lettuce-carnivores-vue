<template>
    <li class="nav-item">
            <router-link
                :to="props.to"
                class="nav-link text-light"
                @click="$emit('collapseNavbar')"
            >{{ props.label }}</router-link>
        </li>
</template>

<script setup lang="ts">

const props = defineProps<{
    to: string,
    label: string,
}>()
</script>

<style scoped>

</style>