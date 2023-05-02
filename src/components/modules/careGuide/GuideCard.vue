<template>
    <div class="guide-card">
        <section class="text-section" :class="altStyle ? 'alt-style' : ''">
            <header class="article-header">
                <h2>{{ careData.label }} Care</h2>
            </header>
            <section class="care-guide">
                <div 
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
                </div>
            </section>
        </section>
        <section class="image-section">
            <img :src="careData.referencePhotoPath" :alt="'an image of ' + careData.label" />
        </section>
    </div>
</template>
<script setup lang="ts">
const props = defineProps(['careData', 'altStyle'])
function getIconUrl(iconFileName) {
    return new URL(`../../../assets/icons/${iconFileName}`, import.meta.url).toString()
}
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
h1,
h2 {
    margin: 0;
}

p,
ul {
    margin: .25em .37em;
}

.guide-card {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    background-color: rgb(54,54,54);
    border-radius: 1em;
    overflow: hidden;
    padding: 0;
    justify-content: space-around;
    margin: 2em 0;
}

.alt-style {
    order: 2;
}

.article-header {
    padding: .7em;
    justify-content: center;
    display: flex
}

.article-header a {
    color: rgb(147, 218, 25);
}

.icon {
    width: 7em;
    height: 7em;
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
}

.content-section {
    flex-direction: row;
    flex-wrap: wrap;
}

.image-section {
    display: flex;
    flex-basis: 500px;
    justify-content: center;
}

.image-section img {
    width: 35em;
    flex: 1;
    padding: 0;
    object-fit: cover;
    justify-content: flex-end;
}

.text-section {
    display: flex;
    flex-direction: column;
    padding: .63em .63em;
    flex: 3;
    flex-basis: 105em;
    line-height: 1.4;
}

.care-guide {
    display: flex;
    flex-direction: column;
    flex: 3;
    justify-content: space-around;
    margin: 0 .25em 0 .5em;
}

.care-guide p {
    display: flex;
    align-items: center;
    padding: 0px .25em;
}

.care-guide ul {
    list-style: none;
    padding-inline-start: 0;
    margin: 4px 30px;

}

.care-guide li {
    padding: .1em 0px;

}

.text-plus-list {
    display: flex;
    flex-direction: column;
}

.text-plus-list ul {
    padding-inline-start: 1.5em;
}

@media screen and (min-width: 1150px) {
    .container-alt .text-section {
        order: 2;
    }

    .text-section {
        flex: 2;
    }

    .image-section {
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