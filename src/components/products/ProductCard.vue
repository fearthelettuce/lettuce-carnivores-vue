<template>
    <article class="card">
       <figure class="mb-2"> 
        <router-link :to="link">
            <img :src="cardImageUrl" :class="cardImageUrl == placeholderUrl ? 'placeholderImage': 'cardImage'" :alt="`An image of ${name}`" />
        </router-link>
        </figure>
        <header class="card-title">
            <h5 class="text-center content-center card-name">{{ name }}</h5>
        </header>
        <footer class="card-footer">
            <div class="flex align-center">
                {{ formattedPrice }}
            </div>
            <BaseButton type="primary" size="normal" @click="$router.push(link)">View Details</BaseButton>
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

<style scoped lang="scss">

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
    align-items: center;
    margin: .5rem .2rem;
}

.card-name {
    line-height: 1.2em;
    height: 3.8em;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    color: $primary;
}

.card-footer {
    display: flex;
    flex-direction: row;
    padding: 1rem;
    overflow: hidden;
    display: flex;
    justify-content: space-around;
    color: $primary;
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