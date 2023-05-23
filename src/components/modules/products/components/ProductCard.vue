<template>
    <div class="card">
       <div> <img :src="cardImageUrl" :class="cardImageUrl == placeholderUrl ? 'placeholderImage': ''" /></div>
        <div class="card-title my-0">
            <div>
                <h5 class="text-primary card-name m-0">{{ product.name }}</h5>
            </div>
            <div>
                <p class="text-primary">{{ formattedPrice }}</p>
            </div>
        </div>
        <div class="card-footer">
            <button class="btn btn-primary">View</button>
        </div>
        
    </div>
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
    width: 100%;
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
    min-height: 4em;
}

.card-footer {
    padding: 18px;
    overflow: hidden;
    border-top: 1px solid #dedede;
    display: flex;
    justify-content: space-between;
}

</style>