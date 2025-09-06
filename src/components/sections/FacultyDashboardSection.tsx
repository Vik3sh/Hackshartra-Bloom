import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FacultyDashboardSectionProps {
  isDarkMode: boolean;
  profile: any;
  onViewDashboard: () => void;
}

const FacultyDashboardSection: React.FC<FacultyDashboardSectionProps> = ({
  isDarkMode,
  profile,
  onViewDashboard
}) => {
  return (
    <div 
      className={`h-screen overflow-y-scroll scroll-smooth scrollbar-hide transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'
      }`}
      style={{
        scrollSnapType: 'y mandatory',
        height: 'calc(100vh - 45px)',
        marginTop: '45px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {/* Hero Section */}
      <div 
        className="flex items-center justify-center"
        style={{
          height: 'calc(100vh - 45px)',
          minHeight: 'calc(100vh - 45px)'
        }}
      >
        <div className="text-center space-y-8 max-w-4xl mx-auto px-6">
          <div className="space-y-6">
            <h1 className={`text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${
              isDarkMode ? 'text-white' : ''
            }`}>
              Faculty Dashboard
            </h1>
            <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Manage student records and academic processes efficiently.
            </p>
          </div>
          <div className="pt-8">
            <Button 
              onClick={onViewDashboard}
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View Full Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Faculty Dashboard Section */}
      <div 
        id="faculty-dashboard-section"
        className="pt-4 pb-8 px-5 scrollbar-hide"
        style={{
          scrollSnapAlign: 'start',
          minHeight: 'calc(100vh - 45px)',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div className="w-full px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                Faculty Management Portal
              </h2>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                Comprehensive tools for managing student records and academic processes.
              </p>
            </div>
            
            {/* Faculty Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              <Card className={`hover:shadow-lg transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h3 className={`font-semibold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Student Management</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>Manage student profiles and records</p>
                </CardContent>
              </Card>

              <Card className={`hover:shadow-lg transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className={`font-semibold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Grade Management</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>Track and manage student grades</p>
                </CardContent>
              </Card>

              <Card className={`hover:shadow-lg transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className={`font-semibold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Analytics</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>View academic performance analytics</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboardSection;

