import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Activity, 
  BookOpen, 
  Trophy, 
  FileText, 
  Bell,
  TrendingUp,
  Users,
  Calendar,
  Star
} from 'lucide-react';
import DiscoverSection from './DiscoverSection';


interface StudentDashboardSectionProps {
  isDarkMode: boolean;
  activeSection: string | null;
  onNavigation: (section: string) => void;
}

const StudentDashboardSection: React.FC<StudentDashboardSectionProps> = ({
  isDarkMode,
  activeSection,
  onNavigation
}) => {
  return (
    <div 
      id="dashboard-section"
      className="pt-4 pb-8 px-5 scrollbar-hide"
      style={{
        scrollSnapAlign: 'start',
        minHeight: 'calc(100vh - 60px)',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <div className="w-full px-4">
        {/* Navigation Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card 
            className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
              activeSection === 'certificates' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => onNavigation('certificates')}
          >
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-slate-700">Certificate Management</h3>
              <p className="text-sm text-slate-500 mt-1">Manage your certificates</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
              activeSection === 'projects' ? 'ring-2 ring-green-500 bg-green-50' : ''
            }`}
            onClick={() => onNavigation('projects')}
          >
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-slate-700">My Project</h3>
              <p className="text-sm text-slate-500 mt-1">Showcase your projects</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
              activeSection === 'activities' ? 'ring-2 ring-purple-500 bg-purple-50' : ''
            }`}
            onClick={() => onNavigation('activities')}
          >
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-slate-700">My Activities</h3>
              <p className="text-sm text-slate-500 mt-1">Track your activities</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
              activeSection === 'academic' ? 'ring-2 ring-orange-500 bg-orange-50' : ''
            }`}
            onClick={() => onNavigation('academic')}
          >
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-orange-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-slate-700">Academic Achievements</h3>
              <p className="text-sm text-slate-500 mt-1">View your achievements</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
              activeSection === 'portfolio' ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
            }`}
            onClick={() => onNavigation('portfolio')}
          >
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-indigo-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-slate-700">Portfolio</h3>
              <p className="text-sm text-slate-500 mt-1">Generate your portfolio</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
              activeSection === 'notifications' ? 'ring-2 ring-red-500 bg-red-50' : ''
            }`}
            onClick={() => onNavigation('notifications')}
          >
            <CardContent className="p-6 text-center">
              <Bell className="h-8 w-8 text-red-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-slate-700">Notifications</h3>
              <p className="text-sm text-slate-500 mt-1">Stay updated</p>
            </CardContent>
          </Card>
        </div>

        {/* Discover Section */}
        <div className="mb-8">
          <DiscoverSection isDarkMode={isDarkMode} userPreferences={{
            interests: ['programming', 'data-science', 'design', 'business'],
            skillLevel: 'intermediate',
            preferredCategories: ['technology', 'academic', 'professional']
          }} />
        </div>

        {/* Student Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>Certificates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">15</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>Activities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">3.8</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>GPA</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      Completed React Course
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      New project uploaded
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      1 day ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      Joined coding club
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      3 days ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Progress
                </h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={isDarkMode ? 'text-gray-300' : 'text-slate-600'}>This Semester</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : ''}`}>
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-5 w-5 text-blue-600" />
                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Collaborators
                </h4>
              </div>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
                  A
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
                  B
                </div>
                <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
                  C
                </div>
                <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
                  +
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="h-5 w-5 text-purple-600" />
                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Upcoming
                </h4>
              </div>
              <div className="space-y-2">
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  <p className="font-medium">Project Deadline</p>
                  <p className="text-xs">March 15, 2024</p>
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  <p className="font-medium">Exam Week</p>
                  <p className="text-xs">March 20-25, 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardSection;

