<template>
    <div class="container border rounded p-4">
        <h2 class="text-center">Create Account</h2>
        <form>
            <div class="form-group">
                <label for="registerEmail">Email</label>
                <input type="email" class="form-control" placeholder="email" id="registerEmail" v-model="registerEmail" />
            </div>
            <div class="form-group mt-3">
                <label for="registerPassword">Password</label>
                <input type="password" class="form-control" placeholder="password" id="registerPassword" v-model="registerPassword" />
            </div>
            <div class="mt-4">
                <button class="btn btn-primary px-3" @click.prevent="register">Register</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/components/modules/auth/stores/users'
import { router } from '@/router/index'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()
const toast = useToast()

const registerEmail = ref("")
const registerPassword = ref("")

const register = async () => {
    try {
        const response = await userStore.register(registerEmail.value, registerPassword.value)
        console.log(response)
        toast.success('Welcome!', {timeout: 1500})
    } catch(error) {
        console.log(error)
    }
    router.push('/')
    
}

</script>