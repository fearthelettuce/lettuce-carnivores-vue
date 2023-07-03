<template>
    
    <div class="hero-image" :style="{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${ highResBackgroundImage}), url(${lowResBackgroundImage})`}">
        <div class="hero-content">
            <div class="hero-text d-flex flex-column">
                <h1 class="hero-name">Lettuce Carnivorus Plants</h1>
                <nav class="d-flex flex-row">
                    <div><router-link
                        to="products" class="hero-link">Shop</router-link>
                    </div>
                    <div><router-link to="recommendations" class="hero-link">What can I grow?</router-link></div>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {getPhotoUrl} from '@/apis/fileServices'

const lowResBackgroundImage = computed(() => {
    return getPhotoUrl('referencePhotos/Heliamphora-minor-top-view-low-res.webp')
})
const highResBackgroundImage = computed(() => {
    return getPhotoUrl('referencePhotos/Heliamphora-minor-top-view.webp')
})



</script>
//TODO: https://www.w3schools.com/howto/howto_css_hero_image.asp
<style scoped>
.hero-image {
    object-fit: contain;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100dvh;
    background-position: 50% 60%;
    background-repeat: no-repeat;
    background-size: cover;
}

.hero-text {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.hero-name{
    font-family: 'Carter One', cursive;
    font-size: 8em;
}

.hero-link {
    font-family: 'Carter One', cursive;
    text-decoration: none;
    margin: 0 2em;
    font-size: 2.5em;
}

</style>

