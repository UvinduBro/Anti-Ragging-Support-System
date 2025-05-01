import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

let firebaseApp: any = null;
let firebaseInitialized = false;

export const initializeFirebase = () => {
  if (firebaseInitialized) return;

  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    appId: process.env.FIREBASE_APP_ID,
  };

  try {
    if (!firebaseApp) {
      firebaseApp = initializeApp(firebaseConfig);
    }
    firebaseInitialized = true;
  } catch (error) {
    console.error("Firebase initialization error:", error);
    throw error;
  }
};

export const getFirebaseFirestore = () => {
  if (!firebaseInitialized) {
    initializeFirebase();
  }
  return getFirestore();
}; 