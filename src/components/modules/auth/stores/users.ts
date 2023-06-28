import { defineStore } from 'pinia'
import { createUser, loginWithEmail, loginWithGoogle, logoutUser, authStateListener } from '@/apis/authServices'
import {findDocById} from '@/apis/dataServices'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        profile: null,
        isLoggedIn: false,
        isAdmin: false,
        error: null,
    }),

    getters: {
        getIsLoggedIn: (state) => state.isLoggedIn,
        getIsAdmin: (state) => state.isAdmin,
        getError: (state) => state.error,
    },

    actions: {
        // async initalizeAuthListener() {
        //     const res = await authStateListener(user: any)
        //     this.user === res.user ? res.user : null

        // },
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
                if(res.user.uid) {
                    this.getUserInformation(res.user.uid)
                }
                return {res}
            }
        },
        async logout(){
            const res = await logoutUser()
            if(res.success) {
                this.isLoggedIn = false
                this.isAdmin = false
            }
        },
        async getUserInformation(userId: string) {
            const res = await findDocById('users',userId)
            if(res) {
                if(res.roles.admin) {
                    this.isAdmin = true
                }
            }
        },
    }
})


//TODO: Retrieve login from local storage
// https://www.youtube.com/watch?v=XWHdFQPkS9Q
