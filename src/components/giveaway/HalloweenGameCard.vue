<template>
    <div class="game-card">
        <component v-if="dynamicComponent !== undefined" :is="dynamicComponent" :class="dynamicComponentClass" title="You found me!"/>

        <Transition>
            <div class="action-container">
                <BaseButton type="trick" size="large" @click="trick">Trick</BaseButton>
                <BaseButton type="treat" size="large" @click="treat" :class="hideTreatButton ? 'fall-off-screen' : ''">Treat</BaseButton>
            </div>
        </Transition>
    </div>


    <Teleport to="body">
        <Transition>
            <div v-show="showGhost" @click="showGhost = !showGhost">
                <div class="ghost-card">
                    <div class="ghost-icon-container">
                        <GhostIcon class="ghost-icon"/>
                    </div>
                    
                    <div class="message-container"><div class="ghost-message">{{ ghostMessage }}</div><h4></h4></div>
                    
                </div>
            </div>
        </Transition>
    </Teleport>
    <Teleport to="body">
        <Transition>
            <div v-show="showBlackout" class="blackout"></div>
        </Transition>
    </Teleport>

</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, defineAsyncComponent, nextTick } from 'vue'
const BatIcon = defineAsyncComponent(() => import( '@/assets/icons/halloween/BatIcon.vue'))
const CandySuckerIcon = defineAsyncComponent(() => import( '@/assets/icons/halloween/CandySuckerIcon.vue'))
const CandyWrappedIcon = defineAsyncComponent(() => import( '@/assets/icons/halloween/CandyWrappedIcon.vue'))
const CauldronIcon = defineAsyncComponent(() => import( '@/assets/icons/halloween/CauldronIcon.vue'))
const GravestoneIcon = defineAsyncComponent(() => import( '@/assets/icons/halloween/GravestoneIcon.vue'))
const PumpkinIcon = defineAsyncComponent(() => import( '@/assets/icons/halloween/PumpkinIcon.vue'))
const SpiderwebIcon = defineAsyncComponent(() => import( '@/assets/icons/halloween/SpiderwebIcon.vue'))
const SpookyTreeIcon = defineAsyncComponent(() => import( '@/assets/icons/halloween/SpookyTreeIcon.vue'))
const VampireIcon = defineAsyncComponent(() => import( '@/assets/icons/halloween/VampireIcon.vue'))
const WitchIcon = defineAsyncComponent(() => import( '@/assets/icons/halloween/WitchIcon.vue'))

import GhostIcon from '@/assets/icons/halloween/GhostIcon.vue';
import { useGiveawayStore } from '@/stores/giveaway'
import { toast } from 'vue3-toastify'
import { storeToRefs } from 'pinia'
const { addLetter, newGame, fetchActiveGiveaway } = useGiveawayStore()
const { isGameComplete, isGameActive, beenRickRolled } = storeToRefs(useGiveawayStore())
    onMounted( async() => {
        await fetchActiveGiveaway()

        if(!isGameActive.value && !isGameComplete.value) {
            newGame()
        }
        const random = Math.floor(Math.random() * 10) + 1
        switch (random){
        case 1:
            dynamicComponent.value = BatIcon
            dynamicComponentClass.value = 'black-icon'
            break
        case 2:
            dynamicComponent.value = CandySuckerIcon
            break
        case 3:
            dynamicComponent.value = CandyWrappedIcon
            break
        case 4:
            dynamicComponent.value = CauldronIcon
            break
        case 5:
            dynamicComponent.value = GravestoneIcon
            break
        case 6:
            dynamicComponent.value = SpiderwebIcon
            break
        case 7:
            dynamicComponent.value = SpookyTreeIcon
            dynamicComponentClass.value = 'black-font'
            break
        case 8:
            dynamicComponent.value = VampireIcon
            break
        case 9:
            dynamicComponent.value = WitchIcon
            break
        default: 
            dynamicComponent.value = PumpkinIcon
            dynamicComponentClass.value = ''
        }
    })
    const dynamicComponent = shallowRef()
    const dynamicComponentClass = ref('')
    const showGhost = shallowRef(false)
    const ghostTimer = ref()
    const ghostMessage = ref('')
    const receivedTreat = ref(false)

    function treat() {
        reset()
        if(isGameComplete.value) {
            ghostMessage.value = `You've collected all the letters! Head to the Giveaway page to enter the giveaway.`
            appendGhost(3500)
            return
        }
        if(receivedTreat.value === true) {
            ghostMessage.value = `Save some for the other kids!  \nHere's a trick instead!`
            appendGhost(1500)
            setTimeout(()=>{trick()},1700)
            return
        }
        
        const nextLetter = addLetter()

        if(nextLetter === undefined || nextLetter === null || nextLetter === '') {
            console.error('Unable to get next letter')
            toast.error('There seems to be an issue. Please contact support@dangerlettuce.com if this issue persists')
            return
         }
        
        if(isGameComplete.value) {
            ghostMessage.value = ghostMessage.value + `Congratulations, you found all the letters!  Head to the Giveaway page to enter!`
            appendGhost(30000)
        } else {
            ghostMessage.value = `I added a '${nextLetter?.toUpperCase()}' to your trick-or-treat bucket.`
            appendGhost(6000)
        }
        receivedTreat.value = true
    }

    function reset() {
        clearTimeout(ghostTimer.value)
        showGhost.value = false
        ghostMessage.value = ''
    }
    
    function trick() {
        reset()
        let randomTrick = Math.random()
        if(randomTrick < .25) {
            blackout()
        } else if(randomTrick < .5) {
            upsideDownScreen()
        } else if (randomTrick < .75) {
            if(beenRickRolled.value === false) {
                rickRoll()
            } else {
                doAFlip()
            }
            beenRickRolled.value = true
        } else if (randomTrick < .9) {
            hideTreat()
        } else {
            doAFlip()
        }
    }

    function appendClassToBody(className: string, timeout = 2000) {
        const bodyEle = document.getElementsByTagName('body')[0]
        bodyEle.classList.add(className)
        setTimeout(() => {bodyEle.classList.remove(className)}, timeout)
    }

    function appendGhost(ghostDuration = 4000) {
        showGhost.value = true
        nextTick()
        ghostTimer.value = setTimeout(() => {showGhost.value = false}, ghostDuration)
    }

    const showBlackout = ref(false)
    function blackout() {
        ghostMessage.value = 'Who turned off the lights???'
        setTimeout(()=>{appendGhost(3000)}, 600)
        showBlackout.value = true
        setTimeout(() => {showBlackout.value = false}, 2500)
        appendClassToBody('hide-overflow', 4500)
    }

    function upsideDownScreen() {
        ghostMessage.value = `I'm so dizzy!`
        appendGhost(6000)
        appendClassToBody('flip-upside-down', 4000)
    }

    function doAFlip() {
        ghostMessage.value = 'Weeeeeeeeeeeeeeeeeeee'
        appendGhost(4500)
        appendClassToBody('hide-overflow', 4000)
        appendClassToBody('barrel-roll', 4000)
    }

    function rickRoll() {
        ghostMessage.value = 'Never gonna GIVE YOU UP.....'
        appendGhost(7000)
        setTimeout(()=>{
            window.open('https://www.youtube.com/watch?v=2qBlE2-WL60','_blank')?.focus()
        }, 400)
    }
    
    const hideTreatButton = ref(false)
    function hideTreat() {
        ghostMessage.value = `You didn't need that anyway, did you?`
        appendGhost(5000)
        appendClassToBody('hide-overflow', 5000)
        hideTreatButton.value = true
        setTimeout(()=>{hideTreatButton.value = false}, 5000)
    }
    
</script>

<style>
    .game-card {
        width: 20rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .action-container {
        margin-top: 1rem;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        width: 100%
    }
    .hide-overflow {
        overflow: hidden;
    }

    .blackout {
        position:fixed;
        top: 0;
        left: 0;
        opacity: 1;
        width: 100dvw;
        height: 100dvh;
        z-index: 9990;
        background-color: black;
    }

    .ghost-card {
        z-index: 9995;
        position: fixed; 
        left: 50dvw;
        transform: translate(-50%, -50%);
        top: 50dvh;
        margin-inline: auto; 
        width: fit-content;
        border-radius: 2rem;
        border: .5rem solid #f4f1dc;
        background-color: black;
        color: #f4f1dc;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .black-font {
        color: black;
    }
    .black-icon {
        filter: brightness(0) saturate(100%) invert(0%) sepia(100%) saturate(7459%) hue-rotate(59deg) brightness(89%) contrast(111%);
    }
    .ghost-icon {
        display: flex;
        filter: brightness(0) saturate(100%) invert(87%) sepia(31%) saturate(146%) hue-rotate(348deg) brightness(108%) contrast(91%);
        width: 100%;
        height: 100%;
        padding: 1rem;
    }
    .message-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        width: 18rem;
    }
    .ghost-message {
        text-align: center;
        font-size: 1.3rem;
        white-space:pre-wrap;
        word-wrap: break-word
    }
    .v-enter-active,
    .v-leave-active {
        transition: opacity .7s ease-in-out;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }

    .upside-down {
        -moz-transform: scale(-1, -1);
        -o-transform: scale(-1, -1);
        -webkit-transform: scale(-1, -1);
        transform: scale(-1, -1);
    }

    .fall-off-screen {
        transform: translateY(100dvh);
        transition: transform 1.5s;
    }

    .barrel-roll {
        animation-name: roll;
        animation-duration: 4s;
        animation-iteration-count: 1;
        /* -moz-animation-name: roll;
        -moz-animation-duration: 4s;
        -moz-animation-iteration-count: 1; */
        /* -webkit-animation-name: roll;
        -webkit-animation-duration: 4s;
        -webkit-animation-iteration-count: 1; */
    }

    /* @-webkit-keyframes roll {
        from { -webkit-transform: rotate(0deg) }
        to   { -webkit-transform: rotate(360deg) }
    }

    @-moz-keyframes roll {
        from { -moz-transform: rotate(0deg) }
        to   { -moz-transform: rotate(360deg) }
    } */

    @keyframes roll {
        from { transform: rotate(0deg) }
        to   { transform: rotate(360deg) }
    }

    .flip-upside-down {
        animation-name: flip;
        animation-duration: 4s;
        animation-iteration-count: 1;
        /* -moz-animation-name: flip;
        -moz-animation-duration: 4s;
        -moz-animation-iteration-count: 1; */
        /* -webkit-animation-name: flip;
        -webkit-animation-duration: 4s;
        -webkit-animation-iteration-count: 1; */
    }

    /* @-webkit-keyframes flip {
        from { -webkit-transform: scale(1, 1) }
        to   { -webkit-transform: scale(1, -1) }
    }

    @-moz-keyframes flip {
        from { -moz-transform: scale(1, 1) }
        to   { -moz-transform: scale(1, -1) }
    } */

    @keyframes flip {
        0% { transform: scale(1, 1) }
        60% { transform: scale(1, -1) }
        80% { transform: scale(1, -1) }
        100% { transform: scale(1, 1) }
    }

    @media(min-width: 80rem) {
        .ghost-card {
            flex-direction: row;
        }
        .ghost-icon {
            padding: 2rem;
        }
        .message-container {
            padding: 2rem 3rem 2rem 0;
            min-width: 30rem;
        }
        .ghost-message {
            font-size: 2rem;
        }
        
    }
</style>