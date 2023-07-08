<template>
    <article class="guide-card">
        <section class="text-section" :class="altStyle ? 'alt-style' : ''">
            <header class="article-header p- d-flex justify-content-center">
                <h2 class="m-0">{{ careData.label }} Care</h2>
            </header>
            <ul class="care-guide">
                <li 
                    v-for="item in careItems"
                    :key="item.label"
                    class="text-item" 
                    :class="altStyle ? 'justify-content-between' : ''"
                >
                    <div class="icon-with-label" :class="altStyle ? 'alt-style' : ''"><img :src="getIconUrl(item.iconUrl)" :alt="item.iconAltText"
                            class="icon" :class="item.class" :title="item.label"><span class="icon-label">{{ item.label }}</span></div>
                    <p>
                        {{ item.textContent }}
                    </p>
                </li>
            </ul>
        </section>
        <section class="image-section">
            <img :src="sectionImageUrl" :alt="'an image of ' + careData.label" />
        </section>
    </article>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import {getPhotoUrl} from '@/apis/fileServices'
const props = defineProps(['careData', 'altStyle'])
function getIconUrl(iconFileName : string) {
    return new URL(`../../../assets/icons/${iconFileName}`, import.meta.url).toString()
}
const sectionImageUrl = computed(() => {
    return getPhotoUrl(props.careData.referencePhotoPath)
})
const careItems = [
    {
        label: 'Locale',
        iconUrl: 'globe-icon.svg',
        iconAltText: 'globe icon',
        textContent: props.careData.locale,
        class: 'globe-icon',
    },
    {
        label: 'Water',
        iconUrl: 'water-icon.svg',
        iconAltText: 'water icon',
        textContent: props.careData.water,
        class: 'water-icon',
    },
    {
        label: 'Humidity',
        iconUrl: 'humidity-icon.svg',
        iconAltText: 'humidity icon',
        textContent: props.careData.humidity,
        class: 'humidity-icon',
    },
    {
        label: 'Light',
        iconUrl: 'sun-icon.svg',
        iconAltText: 'light icon',
        textContent: props.careData.light,
        class: 'light-icon',
    },
    {
        label: 'Media',
        iconUrl: 'media-icon.svg',
        iconAltText: 'media icon',
        textContent: props.careData. media,
        class: 'media-icon',
    },
    {
        label: 'Temp',
        iconUrl: 'temperature-icon.svg',
        iconAltText: 'temperature icon',
        textContent: props.careData.temperature,
        class: 'temperature-icon',
    },
    {
        label: 'Food',
        iconUrl: 'insect-icon.svg',
        iconAltText: 'insect icon',
        textContent: props.careData.fertilization,
        class: 'fertilization-icon',
    }
]

</script>

<style scoped>

p,
ul {
    margin: .25em .37em;
    padding: 0;
}

.guide-card {
    display: flex;
    flex-direction: row;
    /* flex-wrap: nowrap; */
    background-color: rgb(46, 46, 46);
    border-radius: 1.5rem;
    overflow: hidden;
    padding: 0;
    justify-content: space-around;
    margin: 2em 0;
}

.alt-style {
    order: 2;
}

.icon {
    width: 3rem;
    height: 3rem;
    display: inline-flex;
    align-self: center;
    margin: 0;
}

.water-icon {
    filter: invert(45%) sepia(97%) saturate(759%) hue-rotate(191deg) brightness(94%) contrast(95%);
}

.humidity-icon {
    filter: invert(81%) sepia(12%) saturate(1026%) hue-rotate(167deg) brightness(600%) contrast(98%);
}

.icon-with-label {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    display: flex;
}

.icon-label {
    font-size: .75em;
    justify-content: center;
    padding: 0;
    margin-bottom: .1em;
    display: flex;
    color: rgb(216, 227, 196);
}

.text-item {
    flex-direction: row;
    display: flex;
    margin: .7em 0;
    list-style-type: none;
}


.image-section {
    display: none;
    flex-shrink: 2;
    justify-content: center;
}

.image-section img {
    width: 35em;
    padding: 0;
    object-fit: cover;
    justify-content: flex-end;
}

.text-section {
    display: flex;
    flex-direction: column;
    padding: .5em .5em;
    line-height: 1.4;
}

.care-guide {
    display: flex;
    flex-direction: column;
}

.care-guide p {
    display: flex;
    align-items: center;
    padding: 0px .25em;
}

.care-guide ul {
    list-style: none;
    /* padding-inline-start: 0; */
    margin: 4px 30px;

}

.care-guide li {
    padding: .1em 0px;

}

.text-plus-list {
    display: flex;
    flex-direction: column;
}


@media (min-width: 1150px) {
    .container-alt .text-section {
        order: 2;
    }

    .text-section {
        flex: 2;
    }

    .image-section {
        display: flex;
        margin: 0;
        justify-content: flex-end;
    }

    .image-section img {
        flex: 1;
        margin: 0;
        padding: 0;
        flex-basis: 15em;
    }

    .icon {
        width: 3em;
        height: 3em;
    }
}</style>