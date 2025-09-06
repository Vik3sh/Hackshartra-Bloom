import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  isDarkMode: boolean;
  isLoggedIn: boolean;
  onViewDashboard?: () => void;
  profile?: {
    full_name?: string;
    email?: string;
  } | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  isDarkMode, 
  isLoggedIn, 
  onViewDashboard,
  profile 
}) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-8 max-w-4xl mx-auto px-6">
        <div className="space-y-6">
          <h1 className={`text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${
            isDarkMode ? 'text-white' : ''
          }`}>
            {isLoggedIn 
              ? `Welcome Back${profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!` 
              : 'Student Management System'
            }
          </h1>
          <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-slate-600'
          }`}>
            {isLoggedIn 
              ? 'Access your personalized dashboard and manage your academic journey.'
              : 'Streamline academic and co-curricular record management with our comprehensive platform designed for educational excellence.'
            }
          </p>
        </div>
        <div className="space-y-6">
          {isLoggedIn ? (
            <Button 
              onClick={onViewDashboard}
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View Dashboard
            </Button>
          ) : (
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started
              </Button>
            </Link>
          )}
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            {isLoggedIn 
              ? 'Scroll down to explore your dashboard'
              : 'Sign in to access your personalized dashboard'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

