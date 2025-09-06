import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import TopNavigationBar from '@/components/layout/TopNavigationBar';
import HeroSection from '@/components/sections/HeroSection';
import StudentDashboardSection from '@/components/sections/StudentDashboardSection';
import FacultyDashboardSection from '@/components/sections/FacultyDashboardSection';

const HomePage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = React.useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = React.useState(false);

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

  // Navigation handlers
  const handleNavigation = (section: string) => {
    setActiveSection(section);
    console.log(`Navigating to: ${section}`);
    
    // Handle project navigation
    if (section === 'projects') {
      window.location.href = '/projects';
      return;
    }
    
    // For other sections, show alerts for now
    switch(section) {
      case 'certificates':
        alert('Certificate Management - Coming Soon!');
        break;
      case 'activities':
        alert('My Activities - Coming Soon!');
        break;
      case 'academic':
        alert('Academic Achievements - Coming Soon!');
        break;
      case 'portfolio':
        alert('Portfolio Generator - Coming Soon!');
        break;
      case 'notifications':
        alert('Notifications - Coming Soon!');
        break;
      default:
        break;
    }
  };

  const handleViewDashboard = () => {
    const element = document.getElementById('dashboard-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFacultyViewDashboard = () => {
    const element = document.getElementById('faculty-dashboard-section');
    element?.scrollIntoView({ behavior: 'smooth' });
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

  if (!user) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 snap-y snap-mandatory overflow-y-scroll scroll-smooth scrollbar-hide">
        <HeroSection 
          isDarkMode={isDarkMode} 
          isLoggedIn={false}
          profile={null}
        />
      </div>
    );
  }

  // Student Dashboard Section
  if (profile?.role === 'student') {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
        {/* Top Navigation Bar */}
        <TopNavigationBar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          showProfileDropdown={showProfileDropdown}
          setShowProfileDropdown={setShowProfileDropdown}
          showNotificationsDropdown={showNotificationsDropdown}
          setShowNotificationsDropdown={setShowNotificationsDropdown}
          profile={profile}
          signOut={signOut}
          isStudent={true}
        />

        {/* Main Content Container with Scroll Snapping */}
        <div 
          className={`h-screen overflow-y-scroll scroll-smooth scrollbar-hide transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'
          }`}
          style={{
            scrollSnapType: 'y mandatory',
            height: 'calc(100vh - 60px)',
            marginTop: '60px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {/* Hero Section with Scroll Snap */}
          <div 
            className="h-screen flex items-center justify-center"
            style={{ scrollSnapAlign: 'start' }}
          >
            <HeroSection 
              isDarkMode={isDarkMode} 
              isLoggedIn={true} 
              onViewDashboard={handleViewDashboard}
              profile={profile}
            />
          </div>

          {/* Student Dashboard Section with Scroll Snap */}
          <StudentDashboardSection
            isDarkMode={isDarkMode}
            activeSection={activeSection}
            onNavigation={handleNavigation}
          />
        </div>
      </div>
    );
  }

  // Faculty Dashboard Section
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      {/* Faculty Navigation Bar */}
      <TopNavigationBar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        showProfileDropdown={showProfileDropdown}
        setShowProfileDropdown={setShowProfileDropdown}
        showNotificationsDropdown={showNotificationsDropdown}
        setShowNotificationsDropdown={setShowNotificationsDropdown}
        profile={profile}
        signOut={signOut}
        isStudent={false}
      />

      {/* Faculty Dashboard Section */}
      <FacultyDashboardSection
        isDarkMode={isDarkMode}
        profile={profile}
        onViewDashboard={handleFacultyViewDashboard}
      />
    </div>
  );
};

export default HomePage;

