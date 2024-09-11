// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "zds-estate-app.firebaseapp.com",
  projectId: "zds-estate-app",
  storageBucket: "zds-estate-app.appspot.com",
  messagingSenderId: "22806258864",
  appId: "1:22806258864:web:40e62f28c8d5f405c34775",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
