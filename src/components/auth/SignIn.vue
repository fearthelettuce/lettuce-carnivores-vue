<template>
    <div class="bscontainer border rounded p-4">
        <h2 class="textcenter">Login</h2>
        <form>
            <div class="form-group">
                <label for="loginEmail">Email</label>
                <input type="email" class="form-control" placeholder="email" id="loginEmail" v-model="loginEmail" />       
            </div>

            <div class="form-group mt-3">
                <label for="loginPassword">Password</label>
                <input type="password" class="form-control" placeholder="password" id="loginPassword" v-model="loginPassword" />             
            </div>
            <div class="dflex justifycontentaround mt-4">
                <div><BaseButton theme="primary" class="px-4" @click.prevent="login">Login</BaseButton></div>
                
                <div>
                    <BaseButton theme="link-outline" @click.prevent="resetPassword">Trouble signing in?</BaseButton>
                </div>
            </div>
        </form>
        <hr class="my-4"/>
        <!-- <div class="dflex justifycontentcenter">
            <ProviderLogin />
        </div> -->
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

</style>
