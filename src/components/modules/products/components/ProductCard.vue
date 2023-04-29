<template>
    <div>
        <img :src="product.cardImage">
        <p>{{ product.name }}</p>
        <p>{{ product.price }}</p>
        <button 
        class="btn btn-primary"
        >View</button>
    </div>
</template>

<script setup lang="ts">
import ProductsList from './ProductsList.vue';

// const props = defineProps([{
//     product: {
//         type: product,
//         required: true
//     },
//     buttonAction: {
//         type: function,
//     }
// }'product', {}'primaryAction'])

const props = defineProps(['product','cardAction'])
</script>