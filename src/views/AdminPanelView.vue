<template>
    <div class="admin-panel-layout">
        <div class="button-container">
            <BaseButton v-for="component in adminComponents" :key="component.label" size="small"
                @click="setSelectedComponent(component)">{{ component.label }}</BaseButton>
        </div>
        <div class="component-container">
            <component v-if="selectedComponent !== undefined" :is="selectedComponent" />
        </div>


    </div>

</template>

<script setup lang="ts">
import { shallowRef, type Component } from 'vue';
import GiveawayAdmin from '@/components/giveaway/GiveawayAdmin.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import InventoryManagement from '@/components/InventoryManagement.vue'
import OrderAdmin from '@/components/OrderAdmin.vue'
import PlantInventory from '@/components/PlantInventory.vue'
import ProductAdminForm from '@/components/products/ProductAdminForm.vue'

const selectedComponent = shallowRef()

const adminComponents = [
    {
        label: 'Giveaway Admin',
        component: GiveawayAdmin
    },
    {
        label: 'Inventory Management',
        component: InventoryManagement
    },
    {
        label: 'Order Admin',
        component: OrderAdmin,
    },
    {
        label: 'Plant Inventory List',
        component: PlantInventory
    },
    {
        label: 'Product Admin Grid',
        component: ProductAdminForm
    }
]

function setSelectedComponent(adminComponent: { label: string, component: Component }) {
    selectedComponent.value = adminComponent.component
}
</script>

<style scoped>
.admin-panel-layout {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.button-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: .25rem;
    margin-bottom: .5rem;
}

.component-container {
    margin: 0 3dvw;
}

@media (min-width: 50rem) {
    .button-container {
        display: flex;
        flex-direction: row;
        gap: .25rem;
    }
}
</style>
