<template>
    <div class="hero-container">
        <div class="hero-image" :style="{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${ highResBackgroundImage}), url(${lowResBackgroundImage})`}">
            <main class="hero-content">
                <section class="hero-text">
                    <h1 class="hero-name">Lettuce Carnivorous Plants</h1>
                    <nav class="">
                        <router-link to="products" class="hero-link">Shop</router-link>
                        <router-link to="care" class="hero-link">Learn</router-link>
                        <router-link to="recommendations" class="hero-link">Recommend</router-link>
                    </nav>
                </section>
            </main>
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
.hero-container {
    height: 100dvh;
}
.hero-image {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-position: center;
    background-size: cover;
}
.hero-content {
    display: flex;
    justify-content: center;
    align-items: center;
}
.hero-content nav {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 4em 0;
}


.hero-name{
    font-family: 'Carter One', cursive;
    text-align:center;
    font-size: clamp(2.25rem, 5vw, 10rem);
}

.hero-link {
    font-family: 'Carter One', cursive;
    text-decoration: none;
    margin: 0 1em;
    font-size: clamp(1.75rem, 3vw, 5rem);
}

@media (min-width: 40rem) {
    .hero-content nav {
        flex-direction: row;
    }
}

</style>

