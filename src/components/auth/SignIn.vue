<template>
    <div class="login-container">
        <h2 class="text-center">Login</h2>
        <form>
            <div class="">
                <label for="loginEmail">Email</label>
                <input type="email" class="mx-4" placeholder="email" id="loginEmail" v-model="loginEmail" />       
            </div>

            <div class="mt-3">
                <label for="loginPassword">Password</label>
                <input type="password" class="mx-4" placeholder="password" id="loginPassword" v-model="loginPassword" />             
            </div>
            <div class="flex justify-space-around mt-4">
                <div>
                    <BaseButton type="info" @click.prevent="resetPassword">Trouble signing in?</BaseButton>
                </div>
                <div><BaseButton @click.prevent="login">Login</BaseButton></div>
                
            </div>
        </form>
        <hr class="my-4"/>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/users'
import { router } from '@/router/index'
import { toast } from 'vue3-toastify'
//import ProviderLogin from '@/components/auth/ProviderLogin.vue';

const { loginWithGoogle, logInUser } = useUserStore()
const loginEmail = ref("")
const loginPassword = ref("")

async function login () {
    if(!areInputsValid()) {
        toast.error('Unable to login, please check username/password')
        return
    }
    try {
        const loginSuccess = await logInUser(loginEmail.value, loginPassword.value)
        if(!loginSuccess) {
            toast.error('Login unsuccessful, please try again')
            return
        }
        if(router.currentRoute.value.fullPath === '/login') {
            router.push('/products').then(()=>{toast.success('Welcome!')})
        }
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
h2 {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: .5rem;
}
.login-container {
    display: flex;  
    flex-direction: column;
    padding: 3rem;
    border: 1px solid lightgray;
    border-radius: .5rem;
    max-width: 30rem;
}

</style>
<!-- 
TODO Bootstrap: Fix form styles -->