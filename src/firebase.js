import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB7OuN4X0eX2cyg6CC4kDCW3pTcl81ucsE",
    authDomain: "newevent-d687b.firebaseapp.com",
    projectId: "newevent-d687b",
    storageBucket: "newevent-d687b.appspot.com",
    messagingSenderId: "64716541199",
    appId: "1:64716541199:web:4e79deeaf6f2eb4d85827a"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();