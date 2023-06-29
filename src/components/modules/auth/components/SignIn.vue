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
            <div class="mt-4">
                <button class="btn btn-primary px-4" @click.prevent="login">Login</button>
                <div class="form-check d-inline-block ms-4">
                    <input class="form-check-input" type="checkbox" id="rememberMeCheckbox" v-model="rememberMeCheckbox">
                    <label class="form-check-label" for="rememberMeCheckbox">
                        Remember me
                    </label>
                </div>
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

const loginEmail = ref("")
const loginPassword = ref("")
const rememberMeCheckbox = ref(true)

async function login () {
    if(!areInputsValid()) {
        toast.error('Unable to login, please check username/password')
        return
    }
    try {
        await userStore.login(loginEmail.value, loginPassword.value)
        toast.success('Welcome!', {timeout: 1500})
    } catch(error) {
        console.log(error)
        toast.error('Sorry, something went wrong')
    }
    
    router.push('/')
}

function areInputsValid() {
    if(!loginEmail.value || loginEmail.value.length < 8 || !loginPassword.value || loginPassword.value.length < 8 ) {
        return false
    }
    return true
}
</script>