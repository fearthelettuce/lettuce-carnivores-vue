<template>
    <div class="sign-in-options">
        <button 
            v-for="provider of signInOptions" 
            @click="loginPopup(provider.value)"
            class=" sign-in-button"
        ><span v-if="provider.icon !== undefined">
            <img :src="provider.icon" class="provider-icon" />
        </span>{{ provider.buttonLabel }}
    </button>
    </div>
</template>

<script lang="ts">
import { GoogleAuthProvider, FacebookAuthProvider, EmailAuthProvider, PhoneAuthProvider} from 'firebase/auth'
import { toast } from 'vue3-toastify'
export const googleAuthProvider = new GoogleAuthProvider()
const facebookAuthProvider = new FacebookAuthProvider()
facebookAuthProvider.addScope('public_profile')
facebookAuthProvider.addScope('email')
export {facebookAuthProvider}
export const emailAuthProvider = new EmailAuthProvider()
export const phoneAuthProvider = new PhoneAuthProvider(auth)

</script>

<script setup lang="ts">
import { ref, onMounted, type Ref} from 'vue';
import { VueFire, VueFireAuth } from 'vuefire'
import { auth, db } from '@/apis/firebase';
import { useUserStore} from '@/components/modules/auth/stores/users'
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  
} from 'firebase/auth'

import { useCurrentUser, useFirebaseAuth } from 'vuefire'

const signInOptions = [
    {value: 'Google', buttonLabel: 'Sign in with Google', icon: 'src/assets/icons/google.svg'},
    {value: 'Facebook', buttonLabel: 'Sign in with Facebook', icon: 'src/assets/icons/facebook.svg'},
    {value: 'Email', buttonLabel: 'Sign in with Email'},
    {value: 'Phone', buttonLabel: 'Sign in with Phone'},
    {value: 'Guest', buttonLabel: 'Continue as Guest'}
]

function loginPopup(provider: string) {
  error.value = null
  let authProvider
  let authOptions = undefined
  switch(provider) {
    case 'Google':
        authProvider = googleAuthProvider
        break;
    case 'Facebook':
        authProvider = facebookAuthProvider
        break;
    case 'Email': 
        authProvider = emailAuthProvider
        authOptions = {recaptchaParameters: {size: 'invisible'}}
        break;
    case 'Phone':
        authProvider = phoneAuthProvider
        authOptions = {recaptchaParameters: {size: 'invisible'}}
        break;
    default:
        authProvider = undefined
    }

  
    if(authProvider !== undefined) {
        signInWithPopup(auth, authProvider).catch((reason) => {
            console.error('Failed sign', reason)
            error.value = reason
            toast.error('Unable to sign in'); 
            return 
        })
    }

    if(authProvider === undefined) { 

        const res = useUserStore().loginAnonymously()
    }   

}



// display errors if any
const error: Ref<string | null> = ref(null)
function signinRedirect() {
  signInWithRedirect(auth, googleAuthProvider).catch((reason: string) => {
    console.error('Failed signinRedirect', reason)
    error.value = reason
  })
}

// only on client side
onMounted(() => {
  getRedirectResult(auth).catch((reason) => {
    console.error('Failed redirect result', reason)
    error.value = reason
  })
})

</script>

<style scoped>
.sign-in-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width:15rem;
}

.sign-in-button {
    border-radius: .5rem;
}

.provider-icon {
    width: 1.5rem;
    height: 1.5rem;
    display: inline-flex;
    align-self: center;
    margin: 0;
    
}

</style>