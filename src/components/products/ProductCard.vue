<template>
    <article class="card">
       <figure> 
        <router-link :to="link">
            <img :src="cardImageUrl" :class="cardImageUrl == placeholderUrl ? 'placeholderImage': 'cardImage'" :alt="`An image of ${name}`" />
        </router-link>
        </figure>
        <div class="card-details">
            <header class="card-title">
                <h5 class="card-name" @click="$router.push(link)">{{ name }}</h5>
            </header>
            <footer class="card-footer">
                <div class="price">
                    {{ formattedPrice }}
                </div>
                <BaseButton type="primary" size="normal" @click="$router.push(link)">View Details</BaseButton>
            </footer>
        </div>
        
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
    index: number,
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

const gradientColor = computed(() => {
    const remainder = props.index % 6
    const plusOne = remainder + 1
    // if(props.index === 0) return '#80d80e'
    if(plusOne % 6 === 0) return '#20eacc'
    if(plusOne % 5 === 0) return '#aa93fc'
    if(plusOne % 4 === 0) return '#ff6949'
    if(plusOne % 3 === 0) return '#006b90'
    if(plusOne % 2 === 0) return '#FFBF46'
    return '#80d80e'
})

</script>

<style scoped lang="scss">
    .card {
        display: flex;
        flex-direction: column;
        border-radius: 2em;
        overflow:hidden;
        max-width: 45rem;
        justify-content: space-between;
        // background: linear-gradient(0.23turn, v-bind(gradientColor), $light-cream, $light-cream, $light-cream, v-bind(gradientColor));
        // background: radial-gradient(ellipse farthest-side at center, $cream, v-bind(gradientColor));
        box-shadow: 0px -1px 8px 2px $bg-contrast;
    }
    .card-details {
        background: linear-gradient(.3turn, $light-cream, v-bind(gradientColor));
    }

    img {
        display: block;
        height: 100%;
        width: 100%;
        object-fit: cover;
        filter: brightness(110%);
        color: #20eacc;
    }
    h5 {
        font-size: 1.2rem;
        text-align: center;
        align-content: center;
        padding-inline: 1.5rem;
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
        cursor: pointer;
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
        font-size: 1.2rem;
    }
    .card-footer {
        display: flex;
        flex-direction: row;
        padding-inline: 1rem;
        padding-bottom: 1rem;
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