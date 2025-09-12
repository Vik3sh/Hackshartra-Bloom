// Firebase Authentication utilities
import { 
  signInWithCustomToken, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './config';
import { User } from './types';

/**
 * Exchange Supabase JWT for Firebase custom token
 * This function calls the backend to verify Supabase JWT and get Firebase token
 */
export const exchangeSupabaseTokenForFirebase = async (supabaseToken: string): Promise<string> => {
  try {
    const response = await fetch('/api/auth/firebase-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to exchange token');
    }

    const data = await response.json();
    return data.firebaseToken;
  } catch (error) {
    console.error('Error exchanging Supabase token for Firebase token:', error);
    throw error;
  }
};

/**
 * Sign in to Firebase using custom token
 */
export const signInWithFirebaseToken = async (customToken: string): Promise<FirebaseUser> => {
  if (!auth) {
    throw new Error('Firebase not initialized. Please set up your Firebase credentials.');
  }
  
  try {
    const userCredential = await signInWithCustomToken(auth, customToken);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in with Firebase custom token:', error);
    throw error;
  }
};

/**
 * Complete authentication flow: Supabase -> Backend -> Firebase
 */
export const authenticateWithSupabaseAndFirebase = async (supabaseToken: string): Promise<FirebaseUser> => {
  try {
    // Step 1: Exchange Supabase JWT for Firebase custom token
    const firebaseToken = await exchangeSupabaseTokenForFirebase(supabaseToken);
    
    // Step 2: Sign in to Firebase with custom token
    const firebaseUser = await signInWithFirebaseToken(firebaseToken);
    
    return firebaseUser;
  } catch (error) {
    console.error('Authentication flow failed:', error);
    throw error;
  }
};

/**
 * Sign out from Firebase
 */
export const signOut = async (): Promise<void> => {
  if (!auth) {
    console.warn('Firebase not initialized, skipping sign out');
    return;
  }
  
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Listen to Firebase auth state changes
 */
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  if (!auth) {
    console.warn('Firebase not initialized, returning no-op function');
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current Firebase user
 */
export const getCurrentUser = (): FirebaseUser | null => {
  if (!auth) {
    return null;
  }
  return auth.currentUser;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (!auth) {
    return false;
  }
  return !!auth.currentUser;
};
