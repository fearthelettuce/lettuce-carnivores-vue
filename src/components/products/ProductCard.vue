<template>
    <article class="card">
       <figure> 
        <router-link :to="link">
            <img :src="cardImageUrl" :class="cardImageUrl == placeholderUrl ? 'placeholderImage': 'cardImage'" :alt="`An image of ${name}`" />
        </router-link>
        </figure>
        <header class="card-title">
            <h5 class="card-name">{{ name }}</h5>
        </header>
        <footer class="card-footer">
            <div class="price">
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
    margin: 1rem;
    max-width: 45rem;
    justify-content: space-between;
    background: linear-gradient(0.58turn, hsl(87, 15%, 90%), hsl(87, 2%, 95%), hsl(87, 12%, 82%), hsl(87, 2%, 95%), hsl(87, 50%, 82%));
    box-shadow: 0px -1px 10px 3px $light-gray;
}

img {
    display: block;
    height: 100%;
    width: 100%;
    object-fit: cover;
}
figure {
    margin-bottom: .5rem;
}
h5 {
    text-align: center;
    align-content: center;
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

}
.price {
    display: flex;
    align-items: center;
}
.card-footer {
    display: flex;
    flex-direction: row;
    padding: 1rem;
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