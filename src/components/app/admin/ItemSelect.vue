<template>
    <div>

        <select 
            :name="props.selectId" 
            :id="props.selectId"
            class="" 
            :aria-label="props.label" 
            @change="$emit('selectChanged')" 
            :value="productToEdit.id">
            <option value="" style="color: lightsalmon;">Create New Product</option>
            <option v-for="product of products" :value="product.id" :key="product.id" >{{ product.name }} ({{ product.id }})</option>
        </select>

    </div>
</template>

<script setup lang="ts">
import { emit } from 'process';


    const props = defineProps({
        selectId: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: false,
        }
    })

    const emits = defineEmits(['selectChanged'])

</script>

<style scoped>

</style>