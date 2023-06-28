import { auth } from '@/apis/firebase'

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged  } from "firebase/auth";

export async function createUser(email: string, password: string) {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    if (res) {
      return {success: true, user: res.user, error: false, message: 'Welcome!'};
    }
  } catch (err) {
    console.error(err)
    throw new Error ('Unable to register')
  }
}

export async function loginWithEmail(email: string, password: string){
  try {
    const res = await signInWithEmailAndPassword(auth, email, password)
    if(res) {
      return {success: true, user: res.user, error: false, message: 'Welcome!'};
    }
  } catch (err) {
    console.error(err)
    throw new Error ('Unable to log in')
  }
}

export async function loginWithGoogle() {
  return {success: false, user: undefined, error: true, errorDetails: 'This feature is not yet implemented', message: 'Sorry, unable to sign in.  Please try a different sign in method'}
}

export async function logoutUser() {
  try {
    const res = await signOut(auth)
    console.log(res)
    return {success: true, user: undefined, error: false, message: 'You have successfully signed out'};
  } catch (err) {
    console.error(err)
    throw new Error ('Unable to logout')
  }
}

// export async function authStateListener() {
//   const res = await onAuthStateChanged(auth)
//   , (user) => {
//     if(user) {
//       return true
//     } else {
//       return false
//     }
//   })
// }