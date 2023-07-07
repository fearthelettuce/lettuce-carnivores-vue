import type { User as fbUser } from "firebase/auth";
import { defineStore } from "pinia";
import {
  fbAuthStateListener,
  fbCreateAccount,
//   fbGetUserProfile,
  fbSignIn,
  fbSignOut,
  requestPasswordResetEmail,
} from "@/apis/firebaseAuth";
import {findDocById} from '@/apis/dataServices'
export interface User {
  user: any;
  profile: any;
  userError: any;
}

interface State {
  user: fbUser | null;
  userRoles: any;
  profile: any;
  error: null;
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    user: null,
    userRoles: null,
    profile: null,
    error: null,
  }),
  getters: {
    isLoggedIn: (state) => state.user !== null,
    isAdmin: (state) => state.userRoles?.admin,
    userError: (state) => state.error,
  },
  actions: {
    initializeAuthListener() {
      return new Promise((resolve) => {
        fbAuthStateListener(async (user: any) => {
          this.user = user ? user : null;
          if(user) {
            this.getUserRoles(user.uid)
          }
          resolve(true);
        });
      });
    },
    async createAccount(email: string, password: string, first: string, last: string) {
        try {
            const {user, profile} = await fbCreateAccount(email, password, first,last);
            this.user = user ? user : null;
            this.profile = profile ? profile : null;
            this.error = null;
            return true;
        } catch (e: any) {
            this.user = null;
            this.error = e;
            console.log(e)
            return false;
        }
    },
    async logInUser(email: string, password: string) {
      try {
        const response = await fbSignIn(email, password);
        this.user = response.user ? response.user : null;
        this.getUserRoles(response.user.uid)
        this.error = null;
        return true;
      } catch (e: any) {
        this.user = null;
        this.userRoles = null;
        this.error = e;
        return false;
      }
    },

    async requestPasswordReset(email: string) {
      const res = await requestPasswordResetEmail(email)
      if(res) {
        return res
      }
    },

    async logoutUser() {
      try {
        await fbSignOut();
        this.user = null;
        this.userRoles = null
        this.profile = null;
        this.error = null;
        return true;
      } catch (e: any) {
        this.error = e;
        return false;
      }
    },

    async getUserRoles(userId: string) {
      if(!userId) return
        const res = await findDocById('users',userId)
        if(res) {
            if( res.roles.admin ) {
                this.userRoles = res.roles
            }
        }
    },
  },
});