<template>
    <article class="card">
       <figure class="mb-2"> 
        <router-link :to="link">
            <img :src="cardImageUrl" :class="cardImageUrl == placeholderUrl ? 'placeholderImage': 'cardImage'" :alt="`An image of ${name}`" />
        </router-link>
        </figure>
        <header class="card-title ">
            <h5 class="textprimary aligncontentcenter card-name m-0">{{ name }}</h5>
        </header>
        <footer class="card-footer dflex flexrow">
            <div class="dflex alignitemscenter textprimary">
                {{ formattedPrice }}
            </div>
            <BaseButton theme="primary" @click="$router.push(link)">View Details</BaseButton>
        </footer>
        
    </article>
</template>

<script setup lang="ts">

import { computed } from 'vue'
import {getPhotoUrl, placeholderUrl} from '@/composables/usePhotoUtils'
const props = defineProps<{
    name: string,
    price: number | string,
    link: string,
    photoUrl: string | undefined | null,
}>()
const cardImageUrl = computed(() => {
    return getPhotoUrl(props.photoUrl ?? null)
})
const formattedPrice = computed(() => {
    if(typeof props.price === 'number') {
        return props.price > 0 ? USDollar.format(props.price) : '-'
    } else {
        return props.price || '-'
    }
    
})
//TODO: Move USDollar to composables
const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0, 
});

</script>

<style scoped>

.card {
    display: flex;
    flex-direction: column;
    filter: brightness(110%);   
    border-radius: 2em;
    overflow:hidden;
    margin: 0 1rem;
    max-width: 45rem;
    justify-content: space-between;
}

img {
    display: block;
    height: 25em;
    object-fit: cover;
}
.cardImage{
    width: 100%;
}

.placeholderImage {
    box-sizing: border-box;
    padding-top: 1rem;
    margin: auto;
    object-fit: cover;
    object-position: center;
    align-items: center;
    img{
        text-align: center;
        margin: auto auto;
    }
}

.card-title {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 0 .5rem;
}

.card-name {
    line-height: 1.2em;
    height: 3.8em;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
}

.card-footer {
    padding: 18px;
    overflow: hidden;
    display: flex;
    justify-content: space-around;
}

@media(min-width > 60rem) {
    .card {
        display: flex;
        flex-direction: column;
        filter: brightness(110%);   
        border-radius: 2em;
        overflow:hidden;
        margin: 0;
    }
}

</style>