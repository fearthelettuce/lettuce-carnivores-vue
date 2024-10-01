<template>
    <div class="game-container">
        <PumpkinBucket class="bucket" />
        <div class="letter-container">
            <LetterCard v-for="letter in myLetters" class="letter">{{ letter }}</LetterCard>
        </div>
    </div>

</template>


<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue';
import PumpkinBucket from '@/assets/icons/halloween/PumpkinBucket.vue';
import LetterCard from './LetterCard.vue'

const myLetters: Ref<string[]> = ref([])
onMounted(() => {
    myLetters.value.push('G')
    myLetters.value.push('_')
    myLetters.value.push('_')
    myLetters.value.push('S')
    myLetters.value.push('_')
})
</script>

<style scoped>
    .game-container {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .letter-container {
        display: flex;
        flex-direction: row;
        position: absolute;
        top: 30%;
    }
    .letter {

        margin: .5rem;
    }
    /* .bucket {
        position: absolute;
        top: 0;
    } */
</style>