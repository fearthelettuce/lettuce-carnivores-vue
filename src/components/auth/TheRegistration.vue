<template>
    <div class="container border rounded p-4">
        <h2 class="text-center">Create Account</h2>
        <form>
            <div class="form-group">
                <label for="registerEmail">Email</label>
                <input type="email" class="form-control" id="registerEmail" v-model="registrationForm.email" required/>
            </div>
            <div class="form-group mt-3">
                <label for="registerPassword">Password</label>
                <input type="password" class="form-control" id="registerPassword" v-model="registrationForm.password" required/>
            </div>
            <div class="form-group mt-3">
                <label for="registerFirstName">First Name</label>
                <input type="text" class="form-control" id="registerFirstName" v-model="registrationForm.firstName" required/>
            </div>
            <div class="form-group mt-3">
                <label for="registerLastName">Last Name</label>
                <input type="text" class="form-control" id="registerLastName" v-model="registrationForm.lastName" required/>
            </div>
            <div class="d-flex justify-content-center mt-4">
                <button class="btn btn-primary px-3" @click.prevent="register">Register</button>
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