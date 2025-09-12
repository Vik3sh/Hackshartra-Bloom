// Authentication routes for Supabase to Firebase token exchange
import { Router } from 'express';
import { verifySupabaseToken, extractUserFromToken } from '../config/supabase';
import { createCustomToken, adminDb } from '../config/firebase-admin';
import { User } from '../types/user';

const router = Router();

/**
 * POST /api/auth/firebase-token
 * Exchange Supabase JWT for Firebase custom token
 */
router.post('/firebase-token', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authorization header missing or invalid' 
      });
    }

    const supabaseToken = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Step 1: Verify Supabase JWT
    console.log('🔐 Verifying Supabase JWT...');
    const decodedToken = await verifySupabaseToken(supabaseToken);
    
    // Step 2: Extract user information
    const userInfo = extractUserFromToken(decodedToken);
    console.log('👤 User info extracted:', { id: userInfo.id, email: userInfo.email, role: userInfo.role });

    // Step 3: Check if user exists in Firestore, create if not
    const userDoc = await adminDb.collection('users').doc(userInfo.id).get();
    
    if (!userDoc.exists) {
      console.log('👤 Creating new user in Firestore...');
      const newUser: User = {
        uid: userInfo.id,
        email: userInfo.email,
        displayName: userInfo.email.split('@')[0], // Use email prefix as display name
        role: userInfo.role,
        schoolId: userInfo.schoolId,
        grade: userInfo.grade,
        subjects: userInfo.subjects,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          environmentalInterests: [],
          learningLevel: 'beginner',
          notifications: true,
          darkMode: false,
          language: 'en'
        }
      };
      
      await adminDb.collection('users').doc(userInfo.id).set(newUser);
      console.log('✅ New user created in Firestore');
    } else {
      // Update last login time
      await adminDb.collection('users').doc(userInfo.id).update({
        lastLoginAt: new Date()
      });
      console.log('✅ User last login updated');
    }

    // Step 4: Create Firebase custom token
    console.log('🔥 Creating Firebase custom token...');
    const customToken = await createCustomToken(userInfo.id, {
      role: userInfo.role,
      schoolId: userInfo.schoolId,
      email: userInfo.email
    });

    // Step 5: Return Firebase custom token to client
    res.json({
      success: true,
      firebaseToken: customToken,
      user: {
        id: userInfo.id,
        email: userInfo.email,
        role: userInfo.role
      }
    });

  } catch (error) {
    console.error('❌ Error in token exchange:', error);
    res.status(401).json({
      error: 'Token verification failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/auth/verify-firebase-token
 * Verify Firebase ID token (for protected routes)
 */
router.post('/verify-firebase-token', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ 
        error: 'Firebase ID token is required' 
      });
    }

    // Verify Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    res.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: decodedToken.role,
        schoolId: decodedToken.schoolId
      }
    });

  } catch (error) {
    console.error('❌ Error verifying Firebase token:', error);
    res.status(401).json({
      error: 'Firebase token verification failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as authRoutes };
