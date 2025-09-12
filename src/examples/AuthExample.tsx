// Example component showing how to use the authentication flow
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AuthExample: React.FC = () => {
  const { 
    supabaseUser, 
    firebaseUser, 
    userData, 
    loading: authLoading, 
    signInWithSupabase, 
    signUpWithSupabase, 
    signOut 
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await signUpWithSupabase(email, password, {
          role: 'student',
          preferences: {
            environmentalInterests: [],
            learningLevel: 'beginner',
            notifications: true,
            darkMode: false,
            language: 'en'
          }
        });
        alert('Check your email for verification link!');
      } else {
        await signInWithSupabase(email, password);
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      setError(error.message || 'Sign out failed');
    }
  };

  if (authLoading) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-gradient-to-br from-blue-50 to-green-50">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-blue-700 font-medium">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (supabaseUser && firebaseUser) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-gradient-to-br from-blue-50 to-green-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <CardTitle className="text-green-700 text-xl">Authenticated Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-semibold text-blue-900">Supabase User:</h3>
            <p className="text-sm text-blue-700">{supabaseUser.email}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-semibold text-blue-900">Firebase User:</h3>
            <p className="text-sm text-blue-700">{firebaseUser.email}</p>
          </div>
          {userData && (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold text-blue-900">User Data:</h3>
              <p className="text-sm text-blue-700">Role: {userData.role}</p>
            </div>
          )}
          <Button onClick={handleSignOut} variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-gradient-to-br from-blue-50 to-green-50">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🌱</span>
        </div>
        <CardTitle className="text-2xl font-bold text-blue-900">Environmental Education Platform</CardTitle>
        <p className="text-blue-600">
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </p>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleAuth} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}
          
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5"
            disabled={loading}
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
          
          <Button
            type="button"
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-blue-600 hover:text-blue-700"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthExample;
