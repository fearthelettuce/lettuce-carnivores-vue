import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyARDVZXueij6AKI4yQMitc8tqwradplqzc',
  authDomain: 'lettuce-carnivores.firebaseapp.com',
  projectId: 'lettuce-carnivores',
  storageBucket: 'lettuce-carnivores.appspot.com',
  messagingSenderId: '158930764146',
  appId: '1:158930764146:web:e07c3db4987aa639ddddeb',

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
})
const storage = getStorage(app)

export { auth, db, storage }
