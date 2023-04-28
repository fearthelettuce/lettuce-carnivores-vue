<template>
    <div class="container">
        <div class="row">
            <div 
            v-for="product of products"
            :key="product.id"
            class="col"

            >
                <ProductCard :product="product"/>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import ProductCard from './ProductCard.vue';
const products = [
    {
        id: 1001,
        name: 'Nepenthes (ventricosa x sibuyanensis) x flava',
        clone: undefined,
        price: 50,
        genus: 'Nepenthes',
        propagationType: 'Stem Cutting',
        source: 'Unknown',
        isForSale: true,
        quantity: 1,
    },
    {
        id: 1002,
        name: 'Nepenthes undulatifolia x hamata',
        clone: undefined,
        price: 100,
        genus: 'Nepenthes',
        propagationType: 'Basal',
        source: 'Unknown',
        isForSale: true,
        quantity: 1,
    },
    {
        id: 1003,
        name: 'Nepenthes jamban',
        clone: undefined,
        price: 75,
        genus: 'Nepenthes',
        propagationType: 'Stem Cutting',
        source: 'Unknown',
        isForSale: true,
        quantity: 1,
    },
    {
        id: 1004,
        name: 'Nepenthes (ventricosa x sibyanensis) × (talangensis × aristolochioides)',
        clone: undefined,
        price: 75,
        genus: 'Nepenthes',
        propagationType: 'Stem Cutting',
        source: 'Unknown',
        isForSale: true,
        quantity: 1,
    },
    {
        id: 1005,
        name: 'Heliamphora exappendiculata (Apc.) - Ewok',
        clone: undefined,
        price: 100,
        genus: 'Heliamphora',
        propagationType: 'Division',
        source: 'Wistuba',
        isForSale: true,
        quantity: 1,
    },
    {
        id: 1006,
        name: 'Heliamphora minor',
        clone: undefined,
        price: 100,
        genus: 'Heliamphora',
        propagationType: 'Division',
        source: 'Wistuba',
        isForSale: true,
        quantity: 1,
    },
]

</script>


