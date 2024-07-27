<template>
    <div class="container border rounded p-4">
        <h2 class="text-center">Login</h2>
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
                
                <div>
                    <button class="btn btn-outline-link" @click.prevent="resetPassword">Trouble signing in?</button>
                </div>
            </div>
        </form>
        <hr class="my-4"/>
        <div class="d-flex justify-content-center">
            <FirebaseAuth />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/components/modules/auth/stores/users'
import { router } from '@/router/index'
import { toast } from 'vue3-toastify'
import FirebaseAuth from './FirebaseAuth.vue';

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

</style>


<template>
    <!-- <div class="sign-in-options">
        <button  @click="loginPopup(googleAuthProvider)" class=" sign-in-button google-button">
            <span class="provider-icon-span"><GoogleIcon class="provider-icon" /></span>
            <span style="margin-left: .7rem">Sign in with Google</span>
        </button>
        <button @click="loginPopup(facebookAuthProvider)" class=" sign-in-button facebook-button">
            <span class="provider-icon-span"><FacebookIcon class="provider-icon" /></span>
            <span style="margin-left: .7rem">Sign in with Facebook</span>
        </button>
        <button @click="loginPopup(emailAuthProvider, true)" class=" sign-in-button email-button">
            <span class="provider-icon-span"><FacebookIcon class="provider-icon" /></span>
            <span style="margin-left: .7rem">Sign in with Email</span>
        </button>
        <button @click="loginPopup(phoneAuthProvider, true)" class=" sign-in-button phone-button">
            <span class="provider-icon-span"><FacebookIcon class="provider-icon" /></span>
            <span style="margin-left: .7rem">Sign in with Phone</span>
        </button>
    </div> -->

    <section id="firebaseui-auth-container"></section>
<div></div>
</template>

<script lang="ts">
import { GoogleAuthProvider, FacebookAuthProvider, EmailAuthProvider, PhoneAuthProvider} from 'firebase/auth'
import { toast } from 'vue3-toastify'
import GoogleIcon from '@/assets/icons/GoogleIcon.vue';
export const googleAuthProvider = new GoogleAuthProvider()
const facebookAuthProvider = new FacebookAuthProvider()
facebookAuthProvider.addScope('public_profile')
facebookAuthProvider.addScope('email')
export {facebookAuthProvider}
export const emailAuthProvider = new EmailAuthProvider()
export const phoneAuthProvider = new PhoneAuthProvider(auth)
import * as firebaseui from 'firebaseui'
import { onMounted } from 'vue'
</script>

<script setup lang="ts">
import { auth } from '@/apis/firebase';
import { useUserStore} from '@/components/modules/auth/stores/users'
import { router } from '@/router/index'

import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  
} from 'firebase/auth'

onMounted(() =>{
    const ui = new firebaseui.auth.AuthUI(auth)
    const uiConfig = {
        signInSuccessUrl: '/products',
        signInOptions: [GoogleAuthProvider.PROVIDER_ID, FacebookAuthProvider.PROVIDER_ID,EmailAuthProvider.PROVIDER_ID,PhoneAuthProvider.PROVIDER_ID],
    }
    ui.start('#firebaseui-auth-container', uiConfig)
})


async function loginPopup(authProvider: GoogleAuthProvider | FacebookAuthProvider | EmailAuthProvider | PhoneAuthProvider, addRecaptcha: boolean = false) {
    let authOptions = undefined
    if (addRecaptcha) {
        authOptions = {recaptchaParameters: {size: 'invisible'}}
    }
    
    if(authProvider !== undefined) {
        await signInWithPopup(auth, authProvider).catch((reason) => {
            console.error(reason)
            toast.error('Unable to sign in'); 
            return 
        })
        if(router.currentRoute.value.path === '/login') {
            router.push('/products').then(()=>{toast.success('Welcome!')})
        }
    }

    if(authProvider === undefined) { 
        useUserStore().loginAnonymously()
    }   
}

</script>

<style scoped>
.sign-in-options {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    width: 14rem;
    font-weight: 1.5;
}
.sign-in-button:active {
    box-shadow: 0 3px #666;
    transform: translateY(4px);
}

.sign-in-button {
    border-radius: .5rem;
    color: black;
    background-color: white;
    padding: .25rem 0;
    text-align: start;
}
.provider-icon-span {
    display: inline-block;
    width: 1.5rem;
    margin-left: 0.4rem;
}
.provider-icon {
    width: 1.5rem;
    height: 1.5rem;
    display: inline-flex;
    align-self: center;
    margin: 0 .25rem 0.08rem;
    
}
.google-button {

    border: 1px solid hsl(353, 76%, 4%);
}
.email-button {
    background-color: hsl(12, 86%, 53%);
    border: 1px solid hsl(353, 76%, 4%);
    color: white;
    font-weight: 1.5; 
}
.phone-button {
    background-color: hsl(160, 86%, 53%);
    border: 1px solid hsl(353, 76%, 4%);
    color: rgb(14, 67, 52);

}

.guest-button {
    background-color: hsl(50, 96%, 55%);
    border: 1px solid hsl(353, 76%, 4%);
    color: rgb(14, 67, 52);
    font-weight: 1.5;
}

</style>