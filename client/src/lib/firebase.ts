import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

let firebaseApp: any = null;
let firebaseInitialized = false;

export const initializeFirebase = () => {
  if (firebaseInitialized) return;

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  try {
    // Only initialize once
    if (!firebaseApp) {
      firebaseApp = initializeApp(firebaseConfig);
    }
    firebaseInitialized = true;
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
};

export const getFirebaseAuth = () => {
  if (!firebaseInitialized) {
    initializeFirebase();
  }
  return getAuth();
};

export const getFirebaseFirestore = () => {
  if (!firebaseInitialized) {
    initializeFirebase();
  }
  return getFirestore();
};

export const getFirebaseStorage = () => {
  if (!firebaseInitialized) {
    initializeFirebase();
  }
  return getStorage();
};
