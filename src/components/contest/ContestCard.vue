<template>
    <div class="contest-card">
        <component v-if="dynamicComponent !== undefined" :is="dynamicComponent" :class="dynamicComponentClass" title="You found me!"/>

        <Transition>
            <div class="action-container">
                <BaseButton type="trick" size="large" @click="trick">Trick</BaseButton>
                <BaseButton type="treat" size="large" @click="treat" :class="hideTreatButton ? 'fall-off-screen' : ''">Treat</BaseButton>
            </div>
        </Transition>
    </div>



    <Transition>
        <div v-show="showGhost" @click="showGhost = !showGhost">
            <div class="ghost-card">
                    <div class="ghost-icon-container">
                        <GhostIcon class="ghost-icon"/>
                    </div>
                    
                    <div  class="message-container"><h4>{{ ghostMessage }}</h4></div>

            </div>
        </div>
    </Transition>

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

    onMounted(() => {
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
    const dynamicComponent = ref()
    const dynamicComponentClass = ref('')
    const showGhost = shallowRef(false)
    const ghostTimer = ref()
    const ghostMessage = ref('')
    const treatButton = ref()

    function treat() {
        reset()
        appendGhost(6000)
        ghostMessage.value = `One of the letters is G`
    }
    function reset() {
        clearTimeout(ghostTimer.value)
        showGhost.value = false
        ghostMessage.value = ''
    }
    function trick() {
        reset()
        let randomTrick = Math.random()
        console.log(randomTrick)
        if(randomTrick < .2) {
            blackout()
        } else if(randomTrick < .4) {
            upsideDownScreen()
        } else if (randomTrick < .6) {
            rickRoll()
        } else if (randomTrick < .8) {
            hideTreat()
        } else {
            doAFlip()
        }
        //hide treat button
        //swap buttons around
        //two trick buttons
        //load in with two treat buttons, and one is really the trick
        //need trick and treat button labels as variables
    }
    function appendElement(elementId: string, timeout = 3000) {
        const div = document.createElement('div')
        div.id = elementId
        document.getElementsByTagName('body')[0].appendChild(div)
        setTimeout(() => {
            const div = document.getElementById(elementId)
            div?.parentNode?.removeChild(div)
        },timeout)
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
    function blackout() {
        ghostMessage.value = 'Oops, who turned off the lights???'
        
        appendGhost(4000)
        appendElement('blackout', 2000)
        appendClassToBody('hide-overflow', 2000)
    }

    function upsideDownScreen() {
        ghostMessage.value = 'Uh oh, what happened?'
        appendGhost()
        function flip() {    
            Array.prototype.slice.call(  document.querySelectorAll(    'div,p,span,img,a,body,button')).map(function(tag){tag.style['transform'] = 'rotate(' + 180 +'deg)';});
        }
        function unflip() {    
            Array.prototype.slice.call(  document.querySelectorAll(    'div,p,span,img,a,body,button')).map(function(tag){tag.style['transform'] = 'rotate(' + 0 +'deg)';});
        }
        flip()
        setTimeout(() => {unflip()}, 3000)
    }

    function doAFlip() {
        ghostMessage.value = 'Weeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        appendGhost(4500)
        appendClassToBody('hide-overflow', 4000)
        appendClassToBody('barrel-roll', 4000)
    }

    function rickRoll() {
        ghostMessage.value = 'Never gonna GIVE YOU UP.....'
        appendGhost()
        setTimeout(()=>{
            window.open('https://www.youtube.com/watch?v=2qBlE2-WL60','_blank')?.focus()
        }, 400)
    }
    const hideTreatButton = ref(false)
    function hideTreat() {
        ghostMessage.value = `You didn't need that anyway, did you?`
        appendGhost(5000)
        hideTreatButton.value = true
        setTimeout(()=>{hideTreatButton.value = false}, 5000)
    }
    
</script>

<style>
    .contest-card {
        width: 16rem;
    }
    .action-container {
        margin-top: .5rem;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    .hide-overflow {
        overflow: hidden;
    }
    #blackout {
        position:absolute;
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
        position: absolute; 
        left: 0; 
        right: 0; 
        margin-inline: auto; 
        width: fit-content;
        position:absolute;
        border-radius: 2rem;
        border: .5rem solid #f4f1dc;
        background-color: black;
        color: #f4f1dc;
        display: flex;
        flex-direction: row;
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
        padding: 2rem;
    }
    .message-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem 3rem 2rem 0;

    }
    .v-enter-active,
    .v-leave-active {
        transition: opacity .7s ease-in-out;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }

    .transform {
        transform:rotate(180deg);
        -ms-transform:rotate(180deg);
        -webkit-transform:rotate(180deg);
    }

    .barrel-roll {
        -moz-animation-name: roll;
        -moz-animation-duration: 4s;
        -moz-animation-iteration-count: 1;
        -webkit-animation-name: roll;
        -webkit-animation-duration: 4s;
        -webkit-animation-iteration-count: 1;
    }

    @-webkit-keyframes roll {
    from { -webkit-transform: rotate(0deg) }
    to   { -webkit-transform: rotate(360deg) }
    }

    @-moz-keyframes roll {
    from { -moz-transform: rotate(0deg) }
    to   { -moz-transform: rotate(360deg) }
    }

    @keyframes roll {
    from { transform: rotate(0deg) }
    to   { transform: rotate(360deg) }
    }

    .hide-treat {
        opacity: 0;
    }

    .fall-off-screen {
        transform: translateY(100dvh);
        transition: transform 1.5s;
    }

</style>