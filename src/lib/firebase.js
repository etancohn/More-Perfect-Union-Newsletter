// Firebase app + Firestore + Storage, initialized from Vite env vars.
// The web config below is PUBLIC by design (it identifies the project, it is
// not a secret) — access is gated by Firestore/Storage security rules.
//
// To fill these in: Firebase console → Project settings → "Your apps" → Web app
// → copy the config values into a local .env (see .env.example).
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)

// True only when the config has actually been filled in — lets the dashboard
// show a friendly "configure Firebase" message instead of crashing.
export const firebaseReady = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)
