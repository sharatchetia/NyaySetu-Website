import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAF_do7T3V9mwozxYiHJpRw5QfvIr8DKOY",
  authDomain: "college-project-74294.firebaseapp.com",
  projectId: "college-project-74294",
  storageBucket: "college-project-74294.appspot.com",
  messagingSenderId: "574956287878",
  appId: "1:574956287878:web:7e2c64c5a356e2a5471e07"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
