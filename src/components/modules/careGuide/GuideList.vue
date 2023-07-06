<template>
    <div class="guide-container">
        <GuideCard 
            v-for="(value, name, index) in careInfo.genus"
            :key="name" 
            :care-data="value"
            :alt-style="index % 2 !== 0 ? true : false" 
            />
    </div>
</template>
<script setup lang="ts">
import GuideCard from './GuideCard.vue'
import careData from './CareData'
const careInfo = careData.guideData

</script>

<style scoped>
.guide-container {
    max-width: 107em;
    margin: auto;
}

nav ul {
    display: flex;
    list-style: none;
    gap: .6em;
    justify-content: center;
    margin: auto;
}

.nav-item {
    padding: .25em .37em;
    border: 1px solid;
    border-radius: 3px;
    cursor: pointer;
    color: rgb(147, 218, 25);
    font-size: smaller;
}

.nav-item:active,
.nav-item:hover {
    background-color: rgb(147, 218, 25);
    border-color: rgb(147, 218, 25);
    color: rgb(35, 35, 35);
    ;
}

a {
    text-decoration: none;
    color: rgb(29, 212, 245);
}

a:visited {
    color: inherit
}

@media screen and (min-width: 1150px) {
    #page-nav {
        padding: 0 1.em;
        margin: 0;
    }

    .nav-item {
        padding: .63em 1em;
        border: 1px solid;
        border-radius: .5em;
        cursor: pointer;
        color: rgb(147, 218, 25);
    }
}</style>
