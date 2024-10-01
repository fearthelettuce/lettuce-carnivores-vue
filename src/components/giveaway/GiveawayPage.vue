<template>
    <BaseContainer>
        <div class="giveaway-container">

            <div class="giveaway-header">
                <h3>{{ giveawayName }}</h3>
                <h4>{{ giveawayDateText }}</h4>
                <h4>{{ winnerAnnouncedText }}</h4>
                <p>{{ giveawaySummary }}</p>
            </div>
            <component class='game' :is="activeGame" />
        </div>
    </BaseContainer>
    
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HalloweenLetterGame from './HalloweenLetterGame.vue';

    const giveawayName = 'Trick or Treat Giveaway'
    const giveawayDateText = 'October 1 - October 6 9:00PM CDT'
    const winnerAnnouncedText = 'Winner will be announced October 7th'
    const giveawaySummary = 'Look for Halloween themed icons around the site and when you find one, a friendly little ghost might put a letter in your bucket.  Find all the letters and unscramble them to be entered in the giveaway*!'
    const giveawayHelpText = `Need help?`
    const giveawayHelpDetails = `Having issues or just want to enter the giveaway without playing the game?`
    const giveawayBypassText = `Click here to skip the game and enter the giveaway`
    const giveawayRuleReference = `*`
    const giveawayRules = ``
    const activeGame = HalloweenLetterGame
</script>

<style scoped>
    .giveaway-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .giveaway-header {
        width: 30rem;
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .game {
        width: 60rem;
    }
    p {
        text-justify: newspaper;
    }

</style>