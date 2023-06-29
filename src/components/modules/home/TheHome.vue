<template>
    
    <div class="hero-image" :style="{ backgroundImage: 'url(' + backgroundImage + ')' }">
        <div class="container">
            <div class="hero-text">
                <h1>Welcome to Lettuce Carnivorus Plants</h1>
                <nav>
                    <button class="btn btn-outline-primary">View Inventory</button>
                    <button class="btn btn-outline-primary">Recommend Plants for Me</button>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {getPhotoUrl} from '@/apis/fileServices'

const backgroundImage = computed(() => {
    return getPhotoUrl('referencePhotos/Heliamphora-minor-top-view.jpg')
})

</script>
//TODO: https://www.w3schools.com/howto/howto_css_hero_image.asp
<style scoped>
.hero-image{
    height: 100dvh;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
}
</style>

