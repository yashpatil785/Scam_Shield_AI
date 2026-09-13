import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Fallback configuration if env vars are not set yet
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBoLLT6eORiSHUd1eGrrvoEo7uidMewTDg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0097890546.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0097890546",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0097890546.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "712141176972",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:712141176972:web:3a2ecd302a4dd5d2b2bba9",
};

// Initialize Firebase App instance safely (singleton pattern)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Configure local persistence
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Firebase persistence warning:', err);
});

// Configure Google Provider
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',
});
export const googleProvider = provider;
export { GoogleAuthProvider };

// Firestore database instance
const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-scamshieldai-611a8429-f74b-43fe-a564-0c1407cf2b3c";
export const db = getFirestore(app, databaseId);
