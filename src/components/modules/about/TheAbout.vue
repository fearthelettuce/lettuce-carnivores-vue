<template>
    <div class="container mb-5">
        <h1 class="text-3xl font-bold underline text-blue-50">
    Hello world!
  </h1>
        <h4>About Me</h4>
        <p>When I was a kid, my aunt brought me a venus flytrap from a trip to South Carolina.  I quickly proceeded to kill it, not knowing how to care for it, nor putting in the effort to learn.  However, this VFT did not die in vain.  It sparked an itch in me that I have spent a lifetime scratching.  I have seriously been growing carnivorous plants for about 14 years.</p>
        <p>In my day job, I work in Product Management, and I'm an aspiring software engineer.</p>
        <h4>About this site</h4>
            <p>I built this site to pracice my front-end software development skills.  I wanted to address some of the frustrations I've seen with other plant sites... 95% out of stock, broken product filters, clunky user interface, etc.  I hope you have a great experience in using this site. If not, I hope you let me know how I can improve it!</p>
        <h4>My Plants</h4>
        <p>My primary interest in with highland Nepenthes, Heliamphora and Cephalotus. My grow space is limited, so my inventory won't be the same as the larger sellers.  However, I primarily sell rooted divisions/cuttings.  Unlike many other sellers, that import tissue culture plants, the plants you will buy from me are generally established, actively growing, divisions that won't take years to grow to a decent size.</p>   
        <h4>Contact</h4>
        <p>For questions, plesae contact me at dangerlettucecarnivores@gmail.com.</p>
        <a href="https://www.ebay.com/usr/dangerlettuce?_tab=1" target="_blank">See my feedback on eBay</a>
    </div>
    <button @click="showModal">Modal</button>
    <BaseModal modalId="poop" ref="plop">
        <div name="header">Hi</div>
    </BaseModal>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseModal from '@/components/app/UI/BaseModal.vue';
const plop = ref<InstanceType<typeof BaseModal> | null>(null)
function showModal() {
    plop.value?.showModal()
}
</script>