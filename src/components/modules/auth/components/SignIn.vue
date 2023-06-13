<template>
    <div class="container">
        <h1>Login</h1>
        <form>
            <div class="form-group">
                <label for="loginEmail">Email</label>
                <input type="email" class="form-control" placeholder="email" id="loginEmail" v-model="loginEmail" />       
            </div>

            <div class="form-group">
                <label for="loginPassword">Password</label>
                <input type="password" class="form-control" placeholder="password" id="loginPassword" v-model="loginPassword" />             
            </div>
            <button @click="login">Submit</button>
            <button @click="signInWithGoogle">Sign in with Google</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/components/modules/auth/stores/users'
import { router } from '@/router/index'

const authStore = useUserStore()

const loginEmail = ref("")
const loginPassword = ref("")

const login = async () => {
    try {
        const response = await authStore.login(loginEmail.value, loginPassword.value)
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