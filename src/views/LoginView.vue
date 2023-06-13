<template>
    <div class="container mt-4">
        <div class="row">

            <SignIn class="col-4"/>
            <Register class="col-4"/>
        </div>
        
    </div>
</template>

<script setup lang="ts">
import SignIn from '@/components/modules/auth/components/SignIn.vue'
import Register from '@/components/modules/auth/components/Register.vue';
</script>