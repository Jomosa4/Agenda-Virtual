import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCCzUoYuE3tXEGVbcOhD9r7QHVP4kpKJ6I",
    authDomain: "agenda-virtual-2026-2027.firebaseapp.com",
    projectId: "agenda-virtual-2026-2027",
    storageBucket: "agenda-virtual-2026-2027.firebasestorage.app",
    messagingSenderId: "128589903172",
    appId: "1:128589903172:web:ee5e533147492e4f525311",
    measurementId: "G-RZ6BYP9FEV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
