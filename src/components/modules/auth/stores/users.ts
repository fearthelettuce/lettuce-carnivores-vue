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
  profile: Profile | null;
  error: null;
}

type Profile = {
  name: {
    firstName: string,
    lastName: string,
  },
  contactInformation: {
    email: string,
  }
  shippingAddress: {
    firstName: string,
    lastName: string,
    address1: string,
    address2: string,
    city: string,
    state: string,
    postal: string,
  }
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
    isFamily: (state) => state.userRoles?.family,
    userError: (state) => state.error,
    getUserProfile: (state) => state.profile,
  },
  actions: {
    initializeAuthListener() {
      return new Promise((resolve) => {
        fbAuthStateListener(async (user: any) => {
          this.user = user ? user : null;
          if(user) {
            this.fetchUserDetails(user.uid)
          }
          resolve(true);
        });
      });
    },
    async createAccount(email: string, password: string, profileDetails: object) {
        try {
            const {user, profile} = await fbCreateAccount(email, password, profileDetails);
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
        this.fetchUserDetails(response.user.uid)
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
    async fetchUserDetails(userId: string) {
      if(!userId) return
      try {
        const res = await findDocById('users',userId)
        if(res) {
            this.userRoles = res.roles
            this.profile = res.profile
        }
      } catch(e) {
        console.log(e)
        return
      }
      
    },
    // async getUserRoles(userId: string) {
    //   if(!userId) return
    //     const res = await findDocById('users',userId)
    //     if(res) {
    //         if( res.roles ) {
    //             this.userRoles = res.roles
    //         }
    //     }
    // },
    // async getUserProfile(userId: string) {
    //   if(!userId) return
    //     const res = await findDocById('users',userId)
    //     if(res) {
    //         if( res.profile ) {
    //             this.profile = res.profile
    //         }
    //     }
    // },
  },
});