// Firebase Admin SDK configuration
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Service account configuration
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
};

// Initialize Firebase Admin SDK
export const initializeFirebaseAdmin = () => {
  try {
    // Check if Firebase Admin is already initialized
    if (getApps().length === 0) {
      const app = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });

      console.log('🔥 Firebase Admin SDK initialized successfully');
      return app;
    } else {
      console.log('🔥 Firebase Admin SDK already initialized');
      return getApps()[0];
    }
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error);
    throw error;
  }
};

// Export Firebase Admin services
export const adminAuth = getAuth();
export const adminDb = getFirestore();

/**
 * Create a custom Firebase token for a user
 * This is called after verifying the Supabase JWT
 */
export const createCustomToken = async (uid: string, additionalClaims?: Record<string, any>): Promise<string> => {
  try {
    const customToken = await adminAuth.createCustomToken(uid, additionalClaims);
    console.log(`✅ Created custom token for user: ${uid}`);
    return customToken;
  } catch (error) {
    console.error('❌ Error creating custom token:', error);
    throw error;
  }
};

/**
 * Verify a Firebase ID token
 */
export const verifyIdToken = async (idToken: string) => {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('❌ Error verifying Firebase ID token:', error);
    throw error;
  }
};
