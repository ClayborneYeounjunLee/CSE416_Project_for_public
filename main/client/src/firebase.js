import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAunAtIfuTBnyYzAMwkH-aTiuBGEONQEPE",
  authDomain: "cse416-7d42d.firebaseapp.com",
  projectId: "cse416-7d42d",
  storageBucket: "cse416-7d42d.firebasestorage.app",
  messagingSenderId: "938109215156",
  appId: "1:938109215156:web:9f382b56ac4eb9c24ed2e1",
  measurementId: "G-7QF2HD2W9J"
};

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const provider = new GoogleAuthProvider();
  
  export const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user; // Firebase 사용자 정보 반환
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      return null;
    }
  };
  