<template>
<div class="container d-flex flex-column">
        <h4 class="my-4">Enter your new password</h4>
        <div class="form-group">
            <input type="password" class="form-control" id="loginpassword" v-model="loginPassword" />
        </div>
        <div class="my-4">
            <button class="btn btn-primary" @click.prevent="changePassword">Change Password</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/components/modules/auth/stores/users'
const userStore = useUserStore()

const loginPassword = ref("")

function changePassword() {
    console.log(loginPassword.value)
}

</script>