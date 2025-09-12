import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import TopNavigationBar from '@/components/layout/TopNavigationBar';
import HeroSection from '@/components/sections/HeroSection';
import DiscoverSection from '@/components/sections/DiscoverSection';

const HomePage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = React.useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = React.useState(false);
  const [userPreferences, setUserPreferences] = React.useState({
    interests: [] as string[],
    skillLevel: 'beginner',
    preferredCategories: [] as string[]
  });

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
      if (!target.closest('.notifications-dropdown')) {
        setShowNotificationsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Apply dark mode to document
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handlePreferencesChange = (preferences: any) => {
    setUserPreferences(preferences);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-green-50'}`}>
      {/* Navigation Bar - only show if user is logged in */}
      {user && (
        <TopNavigationBar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          showProfileDropdown={showProfileDropdown}
          setShowProfileDropdown={setShowProfileDropdown}
          showNotificationsDropdown={showNotificationsDropdown}
          setShowNotificationsDropdown={setShowNotificationsDropdown}
          profile={profile}
          signOut={signOut}
          isStudent={profile?.role === 'student'}
        />
      )}

      {/* Main Content */}
      <div className={`${user ? 'pt-16' : ''}`}>
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <HeroSection 
            isDarkMode={isDarkMode} 
            isLoggedIn={!!user}
            profile={profile}
          />
        </section>

        {/* Environmental Learning Topics Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <DiscoverSection
              isDarkMode={isDarkMode}
              userPreferences={userPreferences}
              onPreferencesChange={handlePreferencesChange}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;

