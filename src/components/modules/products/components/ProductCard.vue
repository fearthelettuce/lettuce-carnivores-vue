<template>
    <article class="card">
       <figure> 
        <router-link :to="`/products/${product.id}`">
            <img :src="cardImageUrl" :class="cardImageUrl == placeholderUrl ? 'placeholderImage': 'cardImage'" :alt="`An image of ${product.name}`" />
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
import {getPhotoUrl, placeholderUrl} from '@/composables/usePhotoUtils'
const props = defineProps(['product', 'cardAction'])
const cardImageUrl = computed(() => {
    return getPhotoUrl(props.product?.photos[0]?.path ?? null)
})
const formattedPrice = computed(() => {
    return props.product.price > 0 ? USDollar.format(props.product.price) : '-'
})
//TODO: Move USDollar to composables
const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

</script>

<style scoped>
img {
    display: block;
    height: 25em;
    object-fit: cover;
}
.cardImage{
    width: 100%;
    object-position: 0% 15%;
}

.placeholderImage {
    box-sizing: border-box;
    padding-top: 1rem;
    height: 25em;
    margin: auto;
    img{
        width: 100%;
        object-fit: cover;
    }
}
.card {
    display: flex;
    flex-direction: column;
    background-color: rgb(65, 65, 65);
    border-radius: 2em;
    overflow:hidden;
    margin: 1em;
    max-width: 30rem;
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