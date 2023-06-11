import { defineStore } from 'pinia'
import { createUser, loginWithEmail, loginWithGoogle, logout } from '@/apis/authServices'

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
        register(email: string, password: string) {
            createUser(email, password)
        },
        login(email: string, password: string) {
            loginWithEmail(email, password)
            this.isLoggedIn = true
        }
    }
})