<template>
    <div>
        <div id="firebaseui-auth-container"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as firebaseui from 'firebaseui' 
import { GoogleAuthProvider, FacebookAuthProvider, EmailAuthProvider, PhoneAuthProvider} from 'firebase/auth'
import { toast } from 'vue3-toastify'
import { router } from '@/router/index'
import { auth } from '@/apis/firebase';

const firebaseConfigUI = {
    signInSuccessUrl: '/home',
    signInOptions: [
        {provider: GoogleAuthProvider.PROVIDER_ID},
        {
            provider: FacebookAuthProvider.PROVIDER_ID,
            scopes: [
                'public_profile',
                'email'
            ]
        },
        {provider: EmailAuthProvider.PROVIDER_ID},
        // {
        //     provider: PhoneAuthProvider.PROVIDER_ID,
        //     recaptchaParameters: {
        //         size: 'invisible'
        //     }
        // },
        {provider: firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID}
    ],
    callbacks: {
        signInSuccessWithAuthResult: signInAttemptSuccessful,
        signInFailure: signInAttemptFailure,
        uiShown: firebaseUiShown,
    },
    tosUrl: '/about',
    privatePolicyUrl: '/about',
}

onMounted(() => {

    var ui = new firebaseui.auth.AuthUI(auth)
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', firebaseConfigUI)
})

function signInAttemptSuccessful(authResult: any, redirectUrl: string) {
    console.log(authResult)
    router.push(redirectUrl).then(()=>{toast.success('Welcome!')})
    return true
}

function signInAttemptFailure(error: any) {
    console.error(error)
    toast.error(`Unable to sign in - ${error.message}` )
}

function firebaseUiShown () {
    console.log('Firebase UI widget rendered')
}

</script>
<style scoped>

</style>