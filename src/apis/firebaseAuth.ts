import {db, auth} from '@/apis/firebase'

import {
  getDoc,
  doc,
  setDoc,
  getDocs,
  collection,
  // onSnapshot,
} from "firebase/firestore";
import {
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

export const fbCreateAccount = async (
  email: string,
  password: string,
  first: string,
  last: string
) => {
  const response = await createUserWithEmailAndPassword(auth, email, password);
  console.log(response)
  if (response) {
    await fbSetUserProfile({ first, last });
    const profile = await fbGetUserProfile();
    return {
      user: response.user,
      profile,
    };
  } else {
    return {
      user: null,
      profile: null,
    };
  }
};

export const fbSignIn = async (email: string, password: string) => {
  const response = await signInWithEmailAndPassword(auth, email, password);
  return response;
};

export const fbSignOut = async () => {
  await signOut(auth);
  return true;
};

export const fbAuthStateListener = (callback: any) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user);
    } else {
      callback(null);
    }
  });
};

export const fbSetUserProfile = async ({
  first,
  last,
}: {
  first: string;
  last: string;
}) => {
  const user = auth.currentUser;
  const defaultRoles = {user: true, admin: false}
  const ref = doc(db, "users", user?.uid as string);
  await setDoc(
    ref,
    {
      first,
      last,
      roles: defaultRoles,
      uid: user?.uid,
    },
    { merge: true }
  );
  return true;
};

export const fbGetUserProfile = async () => {
  const user = auth.currentUser;
  const ref = doc(db, "users", user?.uid as string);
  const docSnap = await getDoc(ref);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return {
      ...docSnap.data(),
      uid: user?.uid,
    };
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!", user?.uid);
    return null;
  }
};

export async function requestPasswordResetEmail(email: string) {
  try {
    await sendPasswordResetEmail(auth, email)
      return {success: true, error: false, message: 'Password reset email sent!'}
  } catch (e) {
    console.log(e)
    return {error: true, success: false, message: String(e)} 
  }
}

export const queryObjectCollection = async ({
  collectionName,
}: {
  collectionName: string;
}) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const results: any[] = [];

  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    results.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return results;
};

// export const fbCollectionListener = (collectionName: string, callback: any) => {
//   //const unsubscribe = onSnapshot(    not sure why this was declared as a variable
//   onSnapshot(
//     collection(db, collectionName),
//     (snapshot) => {
//       // ...
//       console.log("Listening To Collection: " + collectionName, snapshot);
//       const results: any[] = [];
//       snapshot.forEach((doc) => {
//         results.push({
//           id: doc.id,
//           ...doc.data(),
//         });
//       });
//       callback(results);
//     },
//     (error) => {
//       // ...
//       console.log("Error Listening To Collection: " + collectionName, error);
//     }
//   );
// };