import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  isDarkMode: boolean;
  isLoggedIn: boolean;
  profile?: {
    full_name?: string;
    email?: string;
  } | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  isDarkMode, 
  isLoggedIn, 
  profile 
}) => {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="text-center space-y-8 max-w-4xl mx-auto px-6">
        <div className="space-y-6">
          {/* Logo/Icon */}
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-xl">
            <span className="text-4xl">🌱</span>
          </div>
          
          <h1 className={`text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent ${
            isDarkMode ? 'text-white' : ''
          }`}>
            {isLoggedIn 
              ? `Welcome Back${profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!` 
              : 'Environmental Education Platform'
            }
          </h1>
          <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${
            isDarkMode ? 'text-blue-200' : 'text-blue-700'
          }`}>
            {isLoggedIn 
              ? 'Continue your environmental learning journey with interactive games and challenges.'
              : 'Learn about climate change, sustainability, and environmental conservation through gamified education designed for schools and colleges.'
            }
          </p>
        </div>
        
        {/* Stats/Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="text-2xl font-bold text-blue-600">7 Topics</div>
            <div className="text-sm text-blue-500">Environmental Categories</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="text-2xl font-bold text-green-600">Interactive</div>
            <div className="text-sm text-green-500">Games & Quizzes</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="text-2xl font-bold text-blue-600">Gamified</div>
            <div className="text-sm text-blue-500">Learning Experience</div>
          </div>
        </div>
        
        <div className="space-y-6">
          {isLoggedIn ? (
            <div className="space-y-4">
              <p className={`text-lg ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                Scroll down to explore environmental learning topics
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={() => document.getElementById('categories-page')?.scrollIntoView({ behavior: 'smooth' })}
                  variant="outline"
                  size="lg"
                  className="bg-white/80 hover:bg-white text-blue-600 border-blue-300 hover:border-blue-400"
                >
                  Explore Topics
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Learning
                </Button>
              </Link>
              <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                Sign up to access personalized environmental education
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={() => document.getElementById('categories-page')?.scrollIntoView({ behavior: 'smooth' })}
                  variant="outline"
                  size="lg"
                  className="bg-white/80 hover:bg-white text-blue-600 border-blue-300 hover:border-blue-400"
                >
                  Explore Topics
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Button
          onClick={() => document.getElementById('categories-page')?.scrollIntoView({ behavior: 'smooth' })}
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-white/20"
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;

