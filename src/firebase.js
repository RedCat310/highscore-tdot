import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBNLwcu1Ckzqr4K71fqr6FALIDY1h8im1E",
    authDomain: "highscore-tdot.firebaseapp.com",
    projectId: "highscore-tdot",
    storageBucket: "highscore-tdot.firebasestorage.app",
    messagingSenderId: "53377765655",
    appId: "1:53377765655:web:7f095299ecbf4e2cbf2752"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };