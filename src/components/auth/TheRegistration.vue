<template>
    <div class="login-container">
        <h2 class="text-center">Create Account</h2>
        <form @submit.prevent>
            <div class="gap-4">
                <label for="registerEmail">Email</label>
                <input type="email" class="mx-4" id="registerEmail" v-model="registrationForm.email" required/>
            </div>
            <div class=" mt-3">
                <label for="registerPassword">Password</label>
                <input type="password" class="mx-4" id="registerPassword" v-model="registrationForm.password" required/>
            </div>
            <div class="mt-3">
                <label for="registerFirstName">First Name</label>
                <input type="text" class="mx-4" id="registerFirstName" v-model="registrationForm.firstName" required/>
            </div>
            <div class="mt-3">
                <label for="registerLastName">Last Name</label>
                <input type="text" class="mx-4" id="registerLastName" v-model="registrationForm.lastName" required/>
            </div>
            <div class="flex justify-center mt-4">
                <BaseButton @click.prevent="register">Register</BaseButton>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useUserStore } from '@/stores/users'
import { router } from '@/router/index'
import { toast } from 'vue3-toastify'

const userStore = useUserStore()

const registrationForm = reactive({
    email: null,
    password: null,
    firstName: null,
    lastName: null,
})

const register = async () => {
    if(!registrationForm.email || !registrationForm.password ||  !registrationForm.firstName || !registrationForm.lastName) {
        toast.error('Please check your inputs!')
        return
    }
    try {
        const userResponse = await userStore.createAccount(registrationForm.email, registrationForm.password)
        if(!userResponse) {
            toast.error('Error during registration, please make sure your password is at least 8 characters')
            return
        }
        const profileResponse = await userStore.setUserProfile(
            {
                name: {firstName: registrationForm.firstName, lastName: registrationForm.lastName},
                contactInformation: {email: registrationForm.email},
            }
        )
        if(!profileResponse) {
            toast.error('Error during registration, please review inputs')
            return
        }
        router.push('/products').then(()=>{toast.success('Welcome!')})
        return
    } catch(error) {
        console.log(error)
    }
    toast.error('Error during registration')
}

</script>

<style scoped>

.login-container {
    padding: 3rem;
    border: 1px solid lightgray;
    border-radius: .5rem;
}
</style>

<!-- 
TODO Bootstrap: Fix form styles -->