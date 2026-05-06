import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  Auth,
} from "firebase/auth";

// 🔧 Firebase project config
// These are publishable keys — safe to ship in the client.
// Replace the placeholders below with values from your Firebase project:
//   Firebase Console → Project Settings → General → Your apps → SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdbThiSn_y6tYCHbTdWA2a-9FmQ7XnI7k",
  authDomain: "syncnora-2f3a7.firebaseapp.com",
  projectId: "syncnora-2f3a7",
  storageBucket: "syncnora-2f3a7.firebasestorage.app",
  messagingSenderId: "661612461363",
  appId: "1:661612461363:web:b1220c343f3d55afe25246",
  measurementId: "G-VB5E2GTN2V"
};

export const firebaseApp: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth: Auth = getAuth(firebaseApp);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export interface GoogleProfile {
  uid: string;
  email: string;
  name: string;
  photoURL: string | null;
}

export async function signInWithGoogle(): Promise<GoogleProfile> {
  const result = await signInWithPopup(firebaseAuth, googleProvider);
  const u = result.user;
  return {
    uid: u.uid,
    email: u.email ?? "",
    name: u.displayName ?? (u.email?.split("@")[0] ?? "Google User"),
    photoURL: u.photoURL,
  };
}

export async function firebaseSignOut() {
  try {
    await fbSignOut(firebaseAuth);
  } catch {
    /* ignore */
  }
}
