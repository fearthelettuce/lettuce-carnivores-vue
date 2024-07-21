<template>
    <div class="container mt-4">
        <FirebaseAuth />
        <!-- <div class="row gx-2">
            <SignIn class="col-lg-5 col-md-12 mb-5"/>
            <TheRegistration class="col-lg-5 col-md-12 mb-5"/>

        </div> -->
        
    </div>
</template>

<script setup lang="ts">
import SignIn from '@/components/modules/auth/components/SignIn.vue'
import TheRegistration from '@/components/modules/auth/components/TheRegistration.vue';
import FirebaseAuth from '@/components/modules/auth/components/FirebaseAuthOld.vue';
</script>