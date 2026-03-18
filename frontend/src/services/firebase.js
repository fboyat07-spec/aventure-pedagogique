import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";

export const firebaseConfig = {
  // Expo injects EXPO_PUBLIC_* variables only with static access.
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
};

export function hasFirebaseConfig() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}

export function getFirebaseApp() {
  if (!hasFirebaseConfig()) return null;
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  return getApps()[0];
}

export async function getFirebaseIdToken() {
  const app = getFirebaseApp();
  if (!app) return null;
  const auth = getAuth(app);
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
  if (!auth.currentUser) return null;
  return auth.currentUser.getIdToken();
}
