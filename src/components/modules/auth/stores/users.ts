import { defineStore } from 'pinia'
import { createUser, loginWithEmail, loginWithGoogle, logoutUser } from '@/apis/authServices'
 

export const useUserStore = defineStore('user', {
    state: () => ({
        isLoggedIn: false,
        isAdmin: false,

    }),
    getters: {
        getIsLoggedIn: (state) => {
            return state.isLoggedIn
        }
    },
    actions: {
        async register(email: string, password: string) {
            const res = await createUser(email, password)
            if (res && res.success) {
                this.isLoggedIn = true
                return {res}
            }
        },
        async login(email: string, password: string) {
            const res = await loginWithEmail(email, password)
            if(res && res.success) {
                this.isLoggedIn = true
                return {res}
            }
            
        },
        async logout(){
            const res = await logoutUser()
            if(res.success) {
                this.isLoggedIn = false
            }
        }
    }
})