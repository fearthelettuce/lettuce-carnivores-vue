// import { defineStore } from 'pinia'
// //import { createUser, loginWithEmail, logoutUser, authStateListener } from '@/apis/authServices'
// import {
//   fbAuthStateListener,
//   fbCreateAccount,
//   fbGetUserProfile,
//   fbSignIn,
//   fbSignOut,
// } from "@/apis/firebaseAuth";
// import { User as fbUser } from "firebase/auth";
// import { auth } from '@/apis/firebase'
// import { onAuthStateChanged  } from "firebase/auth";

// import {findDocById} from '@/apis/dataServices'

// export const useUserStore = defineStore('user', {
//     state: () => ({
//         user: null,
//         profile: null,
//         isAdmin: false,
//         error: null,
//         loading: false,
//     }),

//     getters: {
//         isLoggedIn: (state) => state.user !== null,
//         isAdmin: (state) => state.isAdmin,
//         isUserError: (state) => state.error,
//     },

//     actions: {
//         setUser() {
//             this.loading = true
//             onAuthStateChanged(auth, async (user) => {
//                 if (user) {
//                 console.log('onAuthState Observer: user signed in...')
//                 const { displayName, email, photoURL, emailVerified, uid } = user // get what you need from the user object
//                 this.user = { displayName, email, photoURL, emailVerified, uid }
//                 // await this.getUserProfile()
//                 this.loading = false
//                 } else {
//                 console.log('onAuthState Observer: user not logged in or created yet')

//                 this.loading = false
//                 }
//             })
//         },
//         initializeAuthListener() {
//             return new Promise((resolve) => {
//             fbAuthStateListener(async (user: any) => {
//                 this.user = user ? user : null;
//                 resolve(true);
//             });
//             });
//         },
//         async register(email: string, password: string) {
//             const res = await createUser(email, password)
//             if (res && res.success) {
//                 return {res}
//             }
//         },
//         async login(email: string, password: string) {
//             const res = await loginWithEmail(email, password)
//             if(res && res.success) {
//                 if(res.user.uid) {
//                     this.getUserInformation(res.user.uid)
//                 }
//                 return {res}
//             }
//         },
//         async logout(){
//             const res = await logoutUser()
//             if(res.success) {
//                 this.isAdmin = false
//             }
//         },
//         async getUserInformation(userId: string) {
//             const res = await findDocById('users',userId)
//             if(res) {
//                 if(res.roles.admin) {
//                     this.isAdmin = true
//                 }
//             }
//         },
//     }
// })


//TODO: Retrieve login from local storage
// https://www.youtube.com/watch?v=XWHdFQPkS9Q



import type { User as fbUser } from "firebase/auth";
import { defineStore } from "pinia";
import {
  fbAuthStateListener,
  fbCreateAccount,
//   fbGetUserProfile,
  fbSignIn,
  fbSignOut,
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
            console.log(this.user)
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
        const res = await findDocById('users',userId)
        if(res) {
            if( res.roles.admin ) {
                this.userRoles = res.roles
            }
        }
    },
  },
});