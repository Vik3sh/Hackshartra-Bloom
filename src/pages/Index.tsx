import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import FacultyDashboard from '@/components/dashboard/FacultyDashboard';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">Student Management System</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Manage student academic and co-curricular records with ease
            </p>
          </div>
          <div className="space-y-4">
            <Link to="/auth">
              <Button size="lg" className="w-full max-w-sm">
                Sign In / Sign Up
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Sign in to access your dashboard and manage certificates
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {profile?.role === 'student' ? <StudentDashboard /> : <FacultyDashboard />}
      </main>
    </div>
  );
};

export default Index;
