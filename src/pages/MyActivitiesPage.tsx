import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Trophy, 
  Star, 
  TrendingUp, 
  Calendar, 
  ExternalLink, 
  Plus, 
  Search, 
  Filter, 
  ArrowLeft,
  Code,
  BookOpen,
  Users,
  Award,
  Camera,
  Music,
  Paintbrush,
  PenTool,
  Target,
  Zap,
  Heart,
  Briefcase,
  Check
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import TopNavigationBar from '@/components/layout/TopNavigationBar';
import { useNavigate } from 'react-router-dom';

// Activity types and interfaces
interface ActivityItem {
  id: string;
  platform: string;
  type: string;
  title: string;
  description: string;
  date: string;
  value?: string | number;
  url?: string;
  verified: boolean;
  category: 'technical' | 'academic' | 'extracurricular' | 'professional' | 'creative';
}

const MyActivitiesPage: React.FC = () => {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterPlatform, setFilterPlatform] = React.useState('all');
  const [showAddActivityDialog, setShowAddActivityDialog] = React.useState(false);
  const [activities, setActivities] = React.useState<ActivityItem[]>([]);
  const [showProfileDropdown, setShowProfileDropdown] = React.useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = React.useState(false);
  const [showPlatformConnectDialog, setShowPlatformConnectDialog] = React.useState(false);
  const [selectedPlatform, setSelectedPlatform] = React.useState('');
  const [platformUsername, setPlatformUsername] = React.useState('');
  const [isLoadingPlatform, setIsLoadingPlatform] = React.useState(false);

  // Platform configurations
  const platforms = {
    technical: [
      { name: 'LeetCode', icon: Code, color: 'text-orange-500' },
      { name: 'HackerRank', icon: Code, color: 'text-green-500' },
      { name: 'CodeChef', icon: Code, color: 'text-blue-500' },
      { name: 'Kaggle', icon: Target, color: 'text-purple-500' },
      { name: 'GitHub', icon: Code, color: 'text-gray-700' }
    ],
    academic: [
      { name: 'Research', icon: BookOpen, color: 'text-blue-600' },
      { name: 'Publications', icon: BookOpen, color: 'text-indigo-600' },
      { name: 'Scholarships', icon: Award, color: 'text-yellow-600' },
      { name: 'GPA', icon: TrendingUp, color: 'text-green-600' }
    ],
    extracurricular: [
      { name: 'Sports', icon: Trophy, color: 'text-red-500' },
      { name: 'Cultural', icon: Music, color: 'text-pink-500' },
      { name: 'Debate', icon: Users, color: 'text-blue-500' },
      { name: 'Volunteer', icon: Heart, color: 'text-green-500' }
    ],
    professional: [
      { name: 'Internships', icon: Briefcase, color: 'text-indigo-500' },
      { name: 'Workshops', icon: Zap, color: 'text-yellow-500' },
      { name: 'Leadership', icon: Users, color: 'text-purple-500' }
    ],
    creative: [
      { name: 'Art', icon: Paintbrush, color: 'text-pink-500' },
      { name: 'Writing', icon: PenTool, color: 'text-blue-500' },
      { name: 'Photography', icon: Camera, color: 'text-gray-500' },
      { name: 'Music', icon: Music, color: 'text-purple-500' }
    ]
  };

  // Mock data for demonstration with realistic dates
  React.useEffect(() => {
    const generateRandomDate = (daysAgo: number) => {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      return date.toISOString().split('T')[0];
    };

    const mockActivities: ActivityItem[] = [
      // Recent activities (last 30 days)
      {
        id: '1',
        platform: 'LeetCode',
        type: 'Problem Solved',
        title: 'Two Sum',
        description: 'Solved medium difficulty problem',
        date: generateRandomDate(5),
        value: 'Medium',
        url: 'https://leetcode.com/problems/two-sum',
        verified: true,
        category: 'technical'
      },
      {
        id: '2',
        platform: 'HackerRank',
        type: 'Contest',
        title: 'Weekly Contest 123',
        description: 'Participated in weekly coding contest',
        date: generateRandomDate(12),
        value: 'Rank 45',
        verified: true,
        category: 'technical'
      },
      {
        id: '3',
        platform: 'LeetCode',
        type: 'Problem Solved',
        title: 'Binary Tree Inorder Traversal',
        description: 'Solved easy difficulty problem',
        date: generateRandomDate(8),
        value: 'Easy',
        url: 'https://leetcode.com/problems/binary-tree-inorder-traversal',
        verified: true,
        category: 'technical'
      },
      {
        id: '4',
        platform: 'Kaggle',
        type: 'Competition',
        title: 'Titanic Survival Prediction',
        description: 'Participated in data science competition',
        date: generateRandomDate(15),
        value: 'Top 10%',
        verified: true,
        category: 'technical'
      },
      {
        id: '5',
        platform: 'Research',
        type: 'Publication',
        title: 'Machine Learning in Healthcare',
        description: 'Published research paper on ML applications',
        date: generateRandomDate(20),
        value: 'IEEE Conference',
        verified: true,
        category: 'academic'
      },
      {
        id: '6',
        platform: 'Sports',
        type: 'Tournament',
        title: 'Inter-College Basketball',
        description: 'Participated in basketball tournament',
        date: generateRandomDate(25),
        value: '2nd Place',
        verified: true,
        category: 'extracurricular'
      },
      // Activities from 2-3 months ago
      {
        id: '7',
        platform: 'CodeChef',
        type: 'Contest',
        title: 'Long Challenge',
        description: 'Participated in monthly coding challenge',
        date: generateRandomDate(45),
        value: '3 Stars',
        verified: true,
        category: 'technical'
      },
      {
        id: '8',
        platform: 'Art',
        type: 'Exhibition',
        title: 'Digital Art Showcase',
        description: 'Participated in digital art exhibition',
        date: generateRandomDate(60),
        value: 'Featured',
        verified: true,
        category: 'creative'
      },
      {
        id: '9',
        platform: 'GitHub',
        type: 'Contribution',
        title: 'Open Source Contribution',
        description: 'Contributed to React.js repository',
        date: generateRandomDate(35),
        value: '5 commits',
        verified: true,
        category: 'technical'
      },
      // Activities from 4-6 months ago
      {
        id: '10',
        platform: 'Internships',
        type: 'Work Experience',
        title: 'Software Development Intern',
        description: 'Completed summer internship at tech company',
        date: generateRandomDate(90),
        value: '3 months',
        verified: true,
        category: 'professional'
      },
      {
        id: '11',
        platform: 'Music',
        type: 'Performance',
        title: 'College Music Festival',
        description: 'Performed at annual music festival',
        date: generateRandomDate(75),
        value: '1st Place',
        verified: true,
        category: 'creative'
      },
      {
        id: '12',
        platform: 'LeetCode',
        type: 'Problem Solved',
        title: 'Merge Two Sorted Lists',
        description: 'Solved medium difficulty problem',
        date: generateRandomDate(100),
        value: 'Medium',
        verified: true,
        category: 'technical'
      }
    ];
    setActivities(mockActivities);
  }, []);

  // Filter activities based on search and platform
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || activity.platform === filterPlatform;
    const matchesCategory = activeTab === 'all' || activity.category === activeTab;
    return matchesSearch && matchesPlatform && matchesCategory;
  });

  // Calculate statistics
  const totalActivities = activities.length;
  const verifiedActivities = activities.filter(a => a.verified).length;
  const technicalActivities = activities.filter(a => a.category === 'technical').length;
  const recentActivities = activities.filter(a => 
    new Date(a.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'
    }`}>
      <TopNavigationBar 
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        showProfileDropdown={showProfileDropdown}
        setShowProfileDropdown={setShowProfileDropdown}
        showNotificationsDropdown={showNotificationsDropdown}
        setShowNotificationsDropdown={setShowNotificationsDropdown}
        profile={profile}
        signOut={signOut}
      />

      <div className="pt-4 px-4 py-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className={isDarkMode ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-800'}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                My Activities
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                Track your achievements and activities across platforms
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddActivityDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </div>

        {/* Activity Overview with Charts */}
        <div className="mb-8">
          <div className={`rounded-2xl p-8 ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'} border ${isDarkMode ? 'border-gray-700' : 'border-blue-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Activity Dashboard
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  Your journey of achievements and growth
                </p>
              </div>
              <div className="flex space-x-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {totalActivities}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    Total Activities
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {verifiedActivities}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    Verified
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                    {technicalActivities}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    Technical
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {recentActivities}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    This Month
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Bars and Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity Categories Chart */}
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Activity Distribution
                </h3>
                <div className="space-y-3">
                  {Object.entries(platforms).map(([category, platformList]) => {
                    const categoryCount = activities.filter(a => a.category === category).length;
                    const percentage = totalActivities > 0 ? (categoryCount / totalActivities) * 100 : 0;
                    const color = category === 'technical' ? 'bg-orange-500' :
                                 category === 'academic' ? 'bg-blue-500' :
                                 category === 'extracurricular' ? 'bg-green-500' :
                                 category === 'professional' ? 'bg-purple-500' : 'bg-pink-500';
                    
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium capitalize ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                            {category}
                          </span>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                            {categoryCount} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                          <div 
                            className={`h-2 rounded-full ${color}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* GitHub-style Contribution Graph */}
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    Activity Heatmap
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                      {activities.length} activities in the last year
                    </span>
                  </div>
                </div>
                
                {/* Contribution Graph */}
                <div className="overflow-x-auto">
                  <div className="inline-block">
                    {/* Month labels - Show last 12 months */}
                    <div className="flex mb-2">
                      {Array.from({ length: 12 }, (_, i) => {
                        const today = new Date();
                        const monthDate = new Date(today.getFullYear(), today.getMonth() - 11 + i);
                        return (
                          <div key={i} className="w-12 text-center">
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                              {monthDate.toLocaleDateString('en', { month: 'short' })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Contribution grid - GitHub style with proper 365-day calculation */}
                    <div className="flex flex-col space-y-1">
                      {Array.from({ length: 7 }, (_, weekDay) => (
                        <div key={weekDay} className="flex space-x-1">
                          {Array.from({ length: 52 }, (_, week) => {
                            // Calculate date for this cell (last 365 days)
                            const today = new Date();
                            const daysAgo = (51 - week) * 7 + (6 - weekDay);
                            const cellDate = new Date(today);
                            cellDate.setDate(today.getDate() - daysAgo);
                            const dateStr = cellDate.toISOString().split('T')[0];
                            
                            // Only show cells for the last 365 days
                            const oneYearAgo = new Date(today);
                            oneYearAgo.setDate(today.getDate() - 365);
                            
                            if (cellDate < oneYearAgo) {
                              return <div key={`${weekDay}-${week}`} className="w-3 h-3" />;
                            }
                            
                            const dayActivities = activities.filter(a => a.date === dateStr).length;
                            const intensity = Math.min(dayActivities, 4); // Max 4 levels
                            
                            const getColor = (level: number) => {
                              if (level === 0) return isDarkMode ? 'bg-gray-800' : 'bg-gray-100';
                              if (level === 1) return 'bg-green-200';
                              if (level === 2) return 'bg-green-400';
                              if (level === 3) return 'bg-green-600';
                              return 'bg-green-800';
                            };
                            
                            return (
                              <div
                                key={`${weekDay}-${week}`}
                                className={`w-3 h-3 rounded-sm ${getColor(intensity)} hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all`}
                                title={`${cellDate.toLocaleDateString()}: ${dayActivities} activities`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    
                    {/* Legend */}
                    <div className="flex items-center justify-between mt-4 text-xs">
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                        Learn how we count activities
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Less</span>
                        <div className="flex space-x-1">
                          <div className={`w-3 h-3 rounded-sm ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
                          <div className="w-3 h-3 rounded-sm bg-green-200"></div>
                          <div className="w-3 h-3 rounded-sm bg-green-400"></div>
                          <div className="w-3 h-3 rounded-sm bg-green-600"></div>
                          <div className="w-3 h-3 rounded-sm bg-green-800"></div>
                        </div>
                        <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>More</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Streak and Achievements */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {recentActivities} activities this month
                </span>
              </div>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <Trophy className="h-4 w-4 text-green-500" />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {Math.floor(verifiedActivities / Math.max(totalActivities, 1) * 100)}% verified
                </span>
              </div>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {technicalActivities} technical achievements
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Integration - All Categories */}
        <div className="mb-8">
          <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Connect Platforms
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  Import your achievements from various platforms and services
                </p>
              </div>
              <Button
                onClick={() => setShowPlatformConnectDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Connect Platform
              </Button>
            </div>

            {/* All Platform Categories */}
            {Object.entries(platforms).map(([category, platformList]) => (
              <div key={category} className="mb-6">
                <h4 className={`text-lg font-semibold mb-4 capitalize ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {category} Platforms
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {platformList.map((platform) => {
                    const IconComponent = platform.icon;
                    const isConnected = activities.some(a => a.platform === platform.name);
                    
                    return (
                      <div key={platform.name} className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        isConnected 
                          ? `${isDarkMode ? 'bg-green-900/20 border-green-500' : 'bg-green-50 border-green-200'}` 
                          : `${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`
                      }`}>
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`p-2 rounded-lg ${platform.color}`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div>
                            <h5 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                              {platform.name}
                            </h5>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                              {isConnected ? 'Connected' : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        
                        {isConnected ? (
                          <div className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600">
                              {activities.filter(a => a.platform === platform.name).length} activities
                            </span>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPlatform(platform.name);
                              setShowPlatformConnectDialog(true);
                            }}
                            className="w-full"
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Additional Platform Suggestions */}
            <div className="mt-8 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
              <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                Don't see your platform?
              </h4>
              <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                We support many more platforms! You can manually add activities or suggest new platform integrations.
              </p>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddActivityDialog(true)}
                  className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Manually
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert('Platform suggestion feature coming soon!')}
                  className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
                >
                  Suggest Platform
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'}`}
              />
            </div>
          </div>
          <Select value={filterPlatform} onValueChange={setFilterPlatform}>
            <SelectTrigger className={`w-full sm:w-48 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'}`}>
              <SelectValue placeholder="Filter by platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {Object.values(platforms).flat().map(platform => (
                <SelectItem key={platform.name} value={platform.name}>
                  {platform.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Activity Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className={`grid w-full grid-cols-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="extracurricular">Extracurricular</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => {
                const platformConfig = Object.values(platforms).flat().find(p => p.name === activity.platform);
                const IconComponent = platformConfig?.icon || Activity;
                
                return (
                  <div key={activity.id} className={`relative ${index !== filteredActivities.length - 1 ? 'pb-8' : ''}`}>
                    {/* Timeline Line */}
                    {index !== filteredActivities.length - 1 && (
                      <div className={`absolute left-6 top-12 w-0.5 h-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    )}
                    
                    {/* Activity Card */}
                    <div className={`relative flex items-start space-x-4 p-6 rounded-xl hover:shadow-lg transition-all duration-300 ${
                      isDarkMode ? 'bg-gray-800 border border-gray-700 hover:bg-gray-750' : 'bg-white border border-gray-200 hover:bg-gray-50'
                    }`}>
                      {/* Timeline Dot */}
                      <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                        activity.verified 
                          ? 'bg-green-500 text-white' 
                          : isDarkMode 
                            ? 'bg-gray-600 text-gray-300' 
                            : 'bg-gray-200 text-gray-600'
                      }`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      
                      {/* Activity Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                              {activity.title}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-sm font-medium ${platformConfig?.color || 'text-gray-500'}`}>
                                {activity.platform}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                activity.category === 'technical' ? 'bg-orange-100 text-orange-700' :
                                activity.category === 'academic' ? 'bg-blue-100 text-blue-700' :
                                activity.category === 'extracurricular' ? 'bg-green-100 text-green-700' :
                                activity.category === 'professional' ? 'bg-purple-100 text-purple-700' :
                                'bg-pink-100 text-pink-700'
                              }`}>
                                {activity.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {activity.verified && (
                              <div className="flex items-center space-x-1 text-green-600">
                                <Check className="h-4 w-4" />
                                <span className="text-xs font-medium">Verified</span>
                              </div>
                            )}
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                              {new Date(activity.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                          {activity.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {activity.value && (
                              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                              }`}>
                                <Trophy className="h-4 w-4 text-yellow-500" />
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                  {activity.value}
                                </span>
                              </div>
                            )}
                            <div className={`flex items-center space-x-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(activity.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          {activity.url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(activity.url, '_blank')}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredActivities.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    No activities found
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    Try adjusting your search or add a new activity
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Activity Dialog */}
        <Dialog open={showAddActivityDialog} onOpenChange={setShowAddActivityDialog}>
          <DialogContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? 'text-white' : 'text-slate-800'}>
                Add New Activity
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Platform</Label>
                <Select>
                  <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(platforms).map(([category, platformList]) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                          {category}
                        </div>
                        {platformList.map(platform => (
                          <SelectItem key={platform.name} value={platform.name}>
                            {platform.name}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Activity Title</Label>
                <Input
                  placeholder="Enter activity title"
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
                />
              </div>
              
              <div className="space-y-2">
                <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Description</Label>
                <Input
                  placeholder="Enter description"
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
                />
              </div>
              
              <div className="space-y-2">
                <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Date</Label>
                <Input
                  type="date"
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddActivityDialog(false)}
                  className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    alert('Activity added successfully!');
                    setShowAddActivityDialog(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Activity
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Platform Connection Dialog */}
        <Dialog open={showPlatformConnectDialog} onOpenChange={setShowPlatformConnectDialog}>
          <DialogContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? 'text-white' : 'text-slate-800'}>
                Connect {selectedPlatform || 'Platform'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>
                  {selectedPlatform === 'Research' || selectedPlatform === 'Publications' ? 'Author Name' :
                   selectedPlatform === 'Sports' ? 'Player Name' :
                   selectedPlatform === 'Art' || selectedPlatform === 'Photography' ? 'Artist Name' :
                   selectedPlatform === 'Music' ? 'Musician Name' :
                   'Username'}
                </Label>
                <Input
                  placeholder={`Enter your ${selectedPlatform} ${selectedPlatform === 'Research' || selectedPlatform === 'Publications' ? 'author name' :
                   selectedPlatform === 'Sports' ? 'player name' :
                   selectedPlatform === 'Art' || selectedPlatform === 'Photography' ? 'artist name' :
                   selectedPlatform === 'Music' ? 'musician name' :
                   'username'}`}
                  value={platformUsername}
                  onChange={(e) => setPlatformUsername(e.target.value)}
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
                />
              </div>
              
              <div className="space-y-2">
                <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>API Endpoint (Optional)</Label>
                <Input
                  placeholder="https://api.example.com/username"
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
                />
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  Leave empty to use default API endpoints
                </p>
              </div>

              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  What we'll import:
                </h4>
                <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  {selectedPlatform === 'LeetCode' || selectedPlatform === 'HackerRank' || selectedPlatform === 'CodeChef' ? (
                    <>
                      <li>• Solved problems and achievements</li>
                      <li>• Contest rankings and scores</li>
                      <li>• Activity timeline and progress</li>
                      <li>• Skills and technologies used</li>
                    </>
                  ) : selectedPlatform === 'Research' || selectedPlatform === 'Publications' ? (
                    <>
                      <li>• Published papers and citations</li>
                      <li>• Research contributions</li>
                      <li>• Academic achievements</li>
                      <li>• Publication timeline</li>
                    </>
                  ) : selectedPlatform === 'Sports' ? (
                    <>
                      <li>• Tournament participations</li>
                      <li>• Achievements and rankings</li>
                      <li>• Performance statistics</li>
                      <li>• Team memberships</li>
                    </>
                  ) : selectedPlatform === 'Art' || selectedPlatform === 'Photography' ? (
                    <>
                      <li>• Artwork portfolio</li>
                      <li>• Exhibitions and shows</li>
                      <li>• Awards and recognition</li>
                      <li>• Creative timeline</li>
                    </>
                  ) : selectedPlatform === 'Music' ? (
                    <>
                      <li>• Musical performances</li>
                      <li>• Compositions and recordings</li>
                      <li>• Awards and recognition</li>
                      <li>• Musical timeline</li>
                    </>
                  ) : (
                    <>
                      <li>• Platform-specific achievements</li>
                      <li>• Activity timeline and progress</li>
                      <li>• Skills and accomplishments</li>
                      <li>• Recognition and awards</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowPlatformConnectDialog(false)}
                  className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!platformUsername) {
                      alert('Please enter a username');
                      return;
                    }
                    
                    setIsLoadingPlatform(true);
                    
                    // Simulate API call
                    setTimeout(() => {
                      const newActivities: ActivityItem[] = [
                        {
                          id: `api-${Date.now()}`,
                          platform: selectedPlatform,
                          type: 'API Import',
                          title: `Imported from ${selectedPlatform}`,
                          description: `Successfully imported activities for ${platformUsername}`,
                          date: new Date().toISOString().split('T')[0],
                          value: '5 activities',
                          verified: true,
                          category: 'technical'
                        }
                      ];
                      
                      setActivities(prev => [...prev, ...newActivities]);
                      setShowPlatformConnectDialog(false);
                      setPlatformUsername('');
                      setIsLoadingPlatform(false);
                      alert(`Successfully connected to ${selectedPlatform}!`);
                    }, 2000);
                  }}
                  disabled={isLoadingPlatform}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoadingPlatform ? 'Connecting...' : 'Connect Platform'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyActivitiesPage;
