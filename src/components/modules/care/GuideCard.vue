<template>
    <div class="container">
        <section class="text-section">
            <header class="article-header">
                <h2>{{ careData.label }} Care</h2>
            </header>
            <section class="care-guide">
                <div class="text-item">
                    <div class="icon-with-label"><img src="../../assets/icons/globe-icon.svg" alt="globe icon"
                            class="icon globe-icon" title="Locale"><span class="icon-label">Locale</span></div>
                    <p>
                        {{ careData.locale }}
                    </p>
                </div>
                <div class="text-item">
                    <div class="icon-with-label"><img src="../../assets/icons/water-icon.svg" alt="water icon"
                            class="icon water-icon" title="Water"><span class="icon-label">Watering</span></div>
                    <p>{{ careData.water }}</p>
                </div>

                <div class="text-item">
                    <div class="icon-with-label"><img src="../../assets/icons/humidity-icon.svg" alt="humidity icon"
                            class="icon humidity-icon" title="Humidity"><span class="icon-label">Humidity</span></div>
                    <p>
                        {{ careData.humidity }}
                    </p>
                </div>
                <div class="text-item">
                    <div class="icon-with-label"><img src="../../assets/icons/sun-icon.svg" alt="lighting icon" class="icon"
                            title="Lighting"><span class="icon-label">Light</span></div>
                    <p>
                        {{ careData.light }}
                    </p>
                </div>
                <div class="text-item">
                    <div class="icon-with-label"><img src="../../assets/icons/media-icon.svg" alt="potting media icon"
                            class="icon media-icon" title="Media"><span class="icon-label">Media</span></div>
                    <p>
                        {{ careData.media }}
                    </p>
                </div>
                <div class="text-item">
                    <div class="icon-with-label"><img src="../../assets/icons/temperature-icon.svg" alt="temperature icon"
                            class="icon temperature-icon" title="Temperature"><span class="icon-label">Temp</span></div>
                    <p>{{ careData.temperature }}</p>
                </div>
            </section>
        </section>
        <section class="image-section">
            <img :src="careData.referencePhotoPath" :alt="'an image of ' + careData.label" />
        </section>
    </div>
</template>
<script setup lang="ts">
const props = defineProps(['careData'])
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

.container {
    display: flex;
    flex-direction: row;
    background-color: rgb(54, 54, 54);
    margin: 2em 0;
    border-radius: 1em;
    overflow: hidden;
    padding: 0;
    flex-wrap: wrap;
    justify-content: space-around;
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
    width: 5em;
    height: 5em;
    display: inline-flex;
    align-self: center;
    margin: 0;
}

.water-icon {
    filter: invert(45%) sepia(97%) saturate(759%) hue-rotate(191deg) brightness(94%) contrast(95%);
}

.humidity-icon {
    filter: invert(76%) sepia(36%) saturate(4111%) hue-rotate(149deg) brightness(102%) contrast(92%);
}

.icon-with-label {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    display: flex;
}

.icon-label {
    font-size: .5em;
    justify-content: center;
    padding: 0;
    margin-bottom: .1em;
    display: flex;
    color: rgb(216, 227, 196);
}

.text-item {
    flex-direction: row;
    display: flex;
    margin: .37em 0;
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
    max-width: 32em;
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
    flex-basis: 65em;
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
        width: 2.5em;
        height: 2.5em;
    }
}</style>