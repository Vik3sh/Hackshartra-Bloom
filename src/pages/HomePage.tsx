import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import AuthPage from '@/components/auth/AuthPage';

const HomePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  // Redirect to dashboard if user is logged in
  React.useEffect(() => {
    if (user && !authLoading && !profileLoading) {
      navigate('/dashboard');
    }
  }, [user, authLoading, profileLoading, navigate]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show auth page
  if (!user) {
    return <AuthPage />;
  }

  // This should not render as user will be redirected to dashboard
  return null;
};

export default HomePage;

