import { auth } from '@/apis/firebase'

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut  } from "firebase/auth";

export async function createUser(email: string, password: string) {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        return userCredential.user;
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        return {error: true, message: errorMessage}
    });
}

export async function loginWithEmail(email: string, password: string){
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        return userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
}

export async function loginWithGoogle() {

}

export async function logout() {
    signOut(auth).then(() => {
        // Sign-out successful.
        return {success: true, message: "Succesfully logged out"}
      }).catch((error) => {
        console.log(error)
        return {error: true, message: error.toString()}
      });
}