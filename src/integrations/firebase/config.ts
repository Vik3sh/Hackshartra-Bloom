// Firebase configuration for client-side
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration object
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Check if we have real Firebase credentials
const hasRealCredentials = import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_API_KEY !== "your_firebase_api_key";

// Initialize Firebase only if we have real credentials
let app: any = null;
let auth: any = null;
let db: any = null;
let functions: any = null;

if (hasRealCredentials) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    functions = getFunctions(app);
    console.log('🔥 Firebase initialized successfully');
  } catch (error) {
    console.warn('⚠️ Firebase initialization failed:', error);
  }
} else {
  console.warn('⚠️ Firebase not initialized - using demo mode. Please set up your Firebase credentials in .env.local');
}

// Export Firebase services (will be null if not initialized)
export { auth, db, functions };

// Connect to emulators in development (only if Firebase is initialized)
if (import.meta.env.DEV && auth && db && functions) {
  try {
    // Auth emulator
    if (!auth.emulatorConfig) {
      connectAuthEmulator(auth, 'http://localhost:9099');
    }
    
    // Firestore emulator
    if (!db._delegate._databaseId.projectId.includes('demo-')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    
    // Functions emulator
    if (!functions.customDomain) {
      connectFunctionsEmulator(functions, 'localhost', 5001);
    }
  } catch (error) {
    console.warn('⚠️ Firebase emulator connection failed:', error);
  }
}

export default app;
