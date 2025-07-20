import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAqsqJ-dAQBWR3KHwjAKGXOCV_Ux-wN690",
    authDomain: "nema-ecommerce.firebaseapp.com",
    projectId: "nema-ecommerce",
    storageBucket: "nema-ecommerce.firebasestorage.app",
    messagingSenderId: "969196849637",
    appId: "1:969196849637:web:d26bbc9a7169459ac1870c",
    measurementId: "G-FR161G1FCE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
