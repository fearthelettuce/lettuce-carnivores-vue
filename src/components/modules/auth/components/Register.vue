<template>
    <div class="container border">
        <h1>Create Account</h1>
        <form>
            <div class="form-group">
                <label for="registerEmail">Email</label>
                <input type="email" class="form-control" placeholder="email" id="registerEmail" v-model="registerEmail" />
            </div>
            <div class="form-group">
                <label for="registerPassword">Password</label>
                <input type="password" class="form-control" placeholder="password" id="registerPassword" v-model="registerPassword" />
            </div>
            <div class="mt-2">
                <button class="btn btn-primary" @click="register">Register</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/components/modules/auth/stores/users'
import { router } from '@/router/index'

const authStore = useUserStore()

const registerEmail = ref("")
const registerPassword = ref("")

const register = async () => {
    try {
        const response = await authStore.register(registerEmail.value, registerPassword.value)
        console.log(response)
    } catch(error) {
        console.log(error)
    }
    alert('Signed in!')
    router.push('/')
    
}

</script>