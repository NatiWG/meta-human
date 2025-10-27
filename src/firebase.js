import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAQZh6PDzi2CnQ4AX8_1xISHcYo9OwRRnc",
  authDomain: "metahuman-d30d8.firebaseapp.com",
  projectId: "metahuman-d30d8",
  storageBucket: "metahuman-d30d8.firebasestorage.app",
  messagingSenderId: "54383565717",
  appId: "1:54383565717:web:d7d5573ee41fb5d548349c",
  measurementId: "G-DGJ7W11YSZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Analytics solo en producción
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { auth, db, analytics };
