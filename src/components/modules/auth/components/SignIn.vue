<template>
    <div class="container border rounded p-4">
        <h2 class="text-center">Login</h2>
        <div>
            <button class="" @click="googleLogin">Sign in with Google</button>
            
        </div>
        <form>
            <div class="form-group">
                <label for="loginEmail">Email</label>
                <input type="email" class="form-control" placeholder="email" id="loginEmail" v-model="loginEmail" />       
            </div>

            <div class="form-group mt-3">
                <label for="loginPassword">Password</label>
                <input type="password" class="form-control" placeholder="password" id="loginPassword" v-model="loginPassword" />             
            </div>
            <div class="d-flex justify-content-around mt-4">
                <div><button class="btn btn-primary px-4" @click.prevent="login">Login</button></div>
                
                <div class="">
                    <button class="btn btn-outline-link" @click.prevent="resetPassword">Trouble signing in?</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/components/modules/auth/stores/users'
import { router } from '@/router/index'
import { toast } from 'vue3-toastify'
import * as firebaseui from 'firebaseui'

const { loginWithGoogle, logInUser } = useUserStore()
const loginEmail = ref("")
const loginPassword = ref("")

async function login () {
    if(!areInputsValid()) {
        toast.error('Unable to login, please check username/password')
        return
    }
    try {
        await logInUser(loginEmail.value, loginPassword.value)
        router.push('/products').then(()=>{toast.success('Welcome!')})
    } catch(error) {
        console.log(error)
        toast.error('Sorry, something went wrong')
    }
}

async function googleLogin() {
    await loginWithGoogle()

}

function resetPassword(){
    router.push('resetpassword')
}

function areInputsValid() {
    if(!loginEmail.value || loginEmail.value.length < 8 || !loginPassword.value || loginPassword.value.length < 8 ) {
        return false
    }
    return true
}
</script>


<style scoped>

</style>