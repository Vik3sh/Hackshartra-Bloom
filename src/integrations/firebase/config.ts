// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdlLFzsxHMsldaA4n_2X1eZROfq_6rDv0",
  authDomain: "bloom-54f7e.firebaseapp.com",
  projectId: "bloom-54f7e",
  storageBucket: "bloom-54f7e.firebasestorage.app",
  messagingSenderId: "529649287033",
  appId: "1:529649287033:web:b0f16c58a59bad5b9579a8",
  measurementId: "G-3T6B8G9HV0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
