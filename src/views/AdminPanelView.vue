<template>
    <div class="container-fluid mt-4">
        <div class="button-container">
            <BaseButton v-for="component in adminComponents" :key="component.label" @click="setSelectedComponent(component)">{{ component.label }}</BaseButton>
        </div>
        <div class="component-container">
            <component v-if="selectedComponent !== undefined" :is="selectedComponent" />

        </div>


    </div>

</template>

<script setup  lang="ts">
import { ref, type Component } from 'vue';
import GiveawayAdmin from '@/components/giveaway/GiveawayAdmin.vue'
import BaseButton from '@/components/UI/BaseButton.vue'
import InventoryManagement from '@/components/InventoryManagement.vue';

const selectedComponent = ref()

const adminComponents = [
    {
        label: 'Giveaway Admin',
        component: GiveawayAdmin
    },
    {
        label: 'Inventory Management',
        component: InventoryManagement
    }
]

function setSelectedComponent (adminComponent: {label: string, component: Component}) {
    selectedComponent.value = adminComponent.component
}
</script>

<style scoped>

.button-container {
    display: flex;
    flex-direction: column;
    gap: .25rem;
}

.component-container {
    margin: 0 10dvw;
}

@media (min-width: 40rem) {
    .button-container {
    display: flex;
    flex-direction: row;
    gap: .25rem;
}
}
</style>
