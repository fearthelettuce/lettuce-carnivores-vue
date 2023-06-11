<template>
    <h1>Create an Account</h1>
    <input type="text" placeholder="email" v-model="email" />
    <input type="password" placeholder="password" v-model="password" />
    <button @click="register">Submit</button>
    <button @click="signInWithGoogle">Sign in with Google</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/components/modules/auth/stores/users'
import { router } from '@/router/index'

const authStore = useUserStore()

const email = ref("")
const password = ref("")

const register = async () => {
    try {
        const response = await authStore.register(email.value, password.value)
        console.log(response)
    } catch(error) {
        console.log(error)
    }
    alert('Signed in!')
    router.push('/')
    
}

const signInWithGoogle = () => {

}
</script>