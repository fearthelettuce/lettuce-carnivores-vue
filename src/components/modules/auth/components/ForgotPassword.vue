<template>
    <div class="container d-flex flex-column">
        <div v-if="!hasEmailBeenSent">
            <h4 class="my-4">Enter your email</h4>
            <p>If the email matches a registered account, you will receive an email in a minute or two.</p>
            <div class="form-group">
                <input type="email" class="form-control" placeholder="email" id="loginEmail" v-model="loginEmail" />
            </div>
            <div class="my-4">
                <button class="btn btn-primary" @click.prevent="resetPassword">Reset Password</button>
            </div>
        </div>
        <div v-else>
            <p>Reset email has been sent. Please follow the instructions in that email.</p>
        </div>
        
    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/components/modules/auth/stores/users'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()
const toast = useToast()
const loginEmail = ref("")
const hasEmailBeenSent = ref(false)

async function resetPassword () {
    console.log('banana')
    
    const res = await userStore.requestPasswordReset(loginEmail.value)
    if(res && res.success) {
        hasEmailBeenSent.value = true
        toast.success('Reset Email Sent!')
    } else {
        toast.error('Sorry, something went wrong. Please try again')
        hasEmailBeenSent.value = false
    }
}
</script>