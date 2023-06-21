import { defineStore } from 'pinia'
import { createUser, loginWithEmail, loginWithGoogle, logoutUser } from '@/apis/authServices'
import {findDocById} from '@/apis/dataServices'

export const useUserStore = defineStore('user', {
    state: () => ({
        isLoggedIn: false,
        isAdmin: false,
    }),

    getters: {
        getIsLoggedIn: (state) => {
            return state.isLoggedIn
        },
        getIsAdmin: (state) => {
            return state.isAdmin
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
                console.log(res)
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
        }
    }
})