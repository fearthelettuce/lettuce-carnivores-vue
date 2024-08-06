<template>
    <div class="bscontainer mt-4">
        <div class="row gx-2">
            <SignIn class="col-lg-5 col-md-12 mb-5"/>
            <TheRegistration class="col-lg-5 col-md-12 mb-5"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import SignIn from '@/components/auth/SignIn.vue'
import TheRegistration from '@/components/auth/TheRegistration.vue';
</script>