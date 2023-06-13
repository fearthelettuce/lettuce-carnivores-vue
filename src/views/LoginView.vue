<template>
    <div class="container">
        <div class="row">

            <SignIn class="col-3"/>
            <Register class="col-3"/>
        </div>
        
    </div>
</template>

<script setup lang="ts">
import SignIn from '@/components/modules/auth/components/SignIn.vue'
import Register from '@/components/modules/auth/components/Register.vue';
</script>