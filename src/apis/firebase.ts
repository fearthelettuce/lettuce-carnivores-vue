import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyARDVZXueij6AKI4yQMitc8tqwradplqzc',
  authDomain: 'lettuce-carnivores.firebaseapp.com',
  projectId: 'lettuce-carnivores',
  storageBucket: 'lettuce-carnivores.appspot.com',
  messagingSenderId: '158930764146',
  appId: '1:158930764146:web:e07c3db4987aa639ddddeb',

};

const firebaseApp  = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
await setPersistence(auth, browserLocalPersistence)
const db = getFirestore()

const storage = getStorage(firebaseApp)


export { auth, db, storage }
