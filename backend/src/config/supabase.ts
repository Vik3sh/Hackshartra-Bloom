// Supabase configuration for JWT verification
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-client';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// JWKS client for JWT verification
const client = jwksClient({
  jwksUri: `${supabaseUrl}/auth/v1/jwks`,
  cache: true,
  cacheMaxAge: 600000, // 10 minutes
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `${supabaseUrl}/auth/v1/jwks`
});

/**
 * Get signing key for JWT verification
 */
const getKey = (header: any, callback: any) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
};

/**
 * Verify Supabase JWT token
 */
export const verifySupabaseToken = async (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        algorithms: ['RS256'],
        issuer: `${supabaseUrl}/auth/v1`,
        audience: 'authenticated'
      },
      (err, decoded) => {
        if (err) {
          console.error('❌ Error verifying Supabase JWT:', err);
          reject(err);
          return;
        }
        resolve(decoded);
      }
    );
  });
};

/**
 * Extract user information from Supabase JWT
 */
export const extractUserFromToken = (decodedToken: any) => {
  return {
    id: decodedToken.sub,
    email: decodedToken.email,
    role: decodedToken.user_metadata?.role || 'student',
    schoolId: decodedToken.user_metadata?.school_id,
    grade: decodedToken.user_metadata?.grade,
    subjects: decodedToken.user_metadata?.subjects || []
  };
};
