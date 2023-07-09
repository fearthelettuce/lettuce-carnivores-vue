<template>
    <article class="card">
       <figure> 
        <router-link :to="`/products/${product.id}`">
            <img :src="cardImageUrl" :class="cardImageUrl == placeholderUrl ? 'placeholderImage': ''" :alt="`An image of ${product.name}`" />
        </router-link>
        </figure>
        <header class="card-title my-0 justify-content-center align-items-center">
            <h5 class="text-primary text-center card-name m-0">{{ product.name }}</h5>
        </header>
        <footer class="card-footer d-flex flex-row">
            <div class="d-flex align-items-center text-primary">
                {{ formattedPrice }}
            </div>
            <router-link 
                class="btn btn-primary"
                :to="`/products/${product.id}`">View Details
            </router-link>
        </footer>
        
    </article>
</template>

<script setup lang="ts">

//TODO look at cards for inspiration on this website: https://jamesbigleyranches.com/
import { computed } from 'vue'
import {getPhotoUrl} from '@/apis/fileServices'
const props = defineProps(['product', 'cardAction'])
const placeholderUrl = 'https://cdn-icons-png.flaticon.com/512/1033/1033018.png'
//TODO: need to find a way to call store getPhotoUrl, or just build into this component.  Composable?
const cardImageUrl = computed(() => {
    return props.product.photoData?.card ? getPhotoUrl(props.product.photoData.card.fullPath)
    : props.product.photoData?.primary ? getPhotoUrl(props.product.photoData.primary.fullPath)
    : placeholderUrl
})
const formattedPrice = computed(() => {
    return USDollar.format(props.product.price)
})
//TODO: Move USDollar to composables
const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

</script>

<style scoped>
img {
    width: 100%;
    display: block;
    height: 25em;
    object-fit: cover;
}

.placeholderImage {
    box-sizing: border-box;
    padding: 5em;
    height: 25em;
    margin: auto;
}
.card {
    display: flex;
    flex-direction: column;
    background-color: rgb(65, 65, 65);
    border-radius: 2em;
    overflow:hidden;
    margin: 1em;
}

.card-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 1em;
}

.card-name {
    min-height: 2.5em;
}

.card-footer {
    padding: 18px;
    overflow: hidden;
    
    display: flex;
    justify-content: space-around;
}

</style>