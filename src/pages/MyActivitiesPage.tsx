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
import { useBlockchain } from '@/contexts/BlockchainContext';
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
  const { 
    isConnected, 
    walletInfo, 
    connectWallet, 
    disconnectWallet, 
    mintAchievement, 
    getStudentAchievements, 
    verifyAchievement, 
    loading: blockchainLoading, 
    error: blockchainError, 
    clearError 
  } = useBlockchain();
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
  const [showBlockchainDialog, setShowBlockchainDialog] = React.useState(false);
  const [blockchainAchievements, setBlockchainAchievements] = React.useState<any[]>([]);
  const [showActivityDetailDialog, setShowActivityDetailDialog] = React.useState(false);
  const [selectedActivity, setSelectedActivity] = React.useState<ActivityItem | null>(null);

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

  // Blockchain functions
  const handleMintAchievement = async (activity: ActivityItem) => {
    try {
      const achievement = {
        id: activity.id,
        studentId: profile?.student_id || 'unknown',
        title: activity.title,
        description: activity.description,
        category: activity.category,
        issuer: 'Smart Student Hub',
        timestamp: Date.now(),
        verified: activity.verified
      };

      const tokenId = await mintAchievement(achievement);
      alert(`🎉 Achievement minted as NFT!\nToken ID: ${tokenId}\n\nThis achievement is now permanently recorded on the blockchain!`);
    } catch (error) {
      console.error('Error minting achievement:', error);
      alert('Failed to mint achievement. Please try again.');
    }
  };

  const handleLoadBlockchainAchievements = async () => {
    try {
      const achievements = await getStudentAchievements(profile?.student_id || 'unknown');
      setBlockchainAchievements(achievements);
      setShowBlockchainDialog(true);
    } catch (error) {
      console.error('Error loading blockchain achievements:', error);
      alert('Failed to load blockchain achievements.');
    }
  };

  const handleVerifyAchievement = async (tokenId: string) => {
    try {
      const isValid = await verifyAchievement(tokenId);
      alert(`Verification Result: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    } catch (error) {
      console.error('Error verifying achievement:', error);
      alert('Failed to verify achievement.');
    }
  };

  const handleViewActivityDetail = (activity: ActivityItem) => {
    setSelectedActivity(activity);
    setShowActivityDetailDialog(true);
  };

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
          <div className="flex space-x-3">
            <Button
              onClick={() => navigate('/platforms')}
              variant="outline"
              className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-blue-200 text-blue-600 hover:bg-blue-50'}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Connect Platform
            </Button>
            <Button
              onClick={() => setShowAddActivityDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>
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

        {/* Blockchain Integration Section */}
        <div className="mb-8">
          <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-gradient-to-r from-purple-900 to-pink-900' : 'bg-gradient-to-r from-purple-500 to-pink-500'} text-white`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">🔗 Blockchain Achievements</h2>
                <p className="text-purple-100">
                  Turn your activities into permanent, verifiable NFTs on the blockchain
                </p>
              </div>
              <div className="flex space-x-3">
                {!isConnected ? (
                  <Button
                    onClick={connectWallet}
                    disabled={blockchainLoading}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    {blockchainLoading ? 'Connecting...' : 'Connect Wallet'}
                  </Button>
                ) : (
                  <Button
                    onClick={disconnectWallet}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    Disconnect
                  </Button>
                )}
                {isConnected && (
                  <Button
                    onClick={handleLoadBlockchainAchievements}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    View My NFTs
                  </Button>
                )}
              </div>
            </div>

            {isConnected && walletInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-1">Wallet Address</h4>
                  <p className="text-sm text-purple-100 font-mono">
                    {walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-1">Network</h4>
                  <p className="text-sm text-purple-100">{walletInfo.network}</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-1">Balance</h4>
                  <p className="text-sm text-purple-100">{walletInfo.balance} MATIC</p>
                </div>
              </div>
            ) : (
              <div className="bg-white/20 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-purple-100 mb-4">
                  Connect your MetaMask wallet to start minting your achievements as NFTs
                </p>
                <Button
                  onClick={connectWallet}
                  disabled={blockchainLoading}
                  className="bg-white text-purple-600 hover:bg-purple-50"
                >
                  {blockchainLoading ? 'Connecting...' : 'Connect MetaMask'}
                </Button>
              </div>
            )}

            {blockchainError && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-4">
                <p className="text-red-100 text-sm">{blockchainError}</p>
                <Button
                  onClick={clearError}
                  className="mt-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 text-sm"
                >
                  Dismiss
                </Button>
              </div>
            )}
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

        {/* Activity Categories - Organized Sections */}
        <div className="space-y-8">
          {/* Technical Activities Section */}
          <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Code className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    Technical Achievements
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    Coding, programming, and technical skills
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  {activities.filter(a => a.category === 'technical').length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('technical')}
                  className="text-orange-600 border-orange-200 hover:bg-orange-50"
                >
                  View All
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.filter(a => a.category === 'technical').slice(0, 3).map((activity, index) => {
                const platformConfig = Object.values(platforms).flat().find(p => p.name === activity.platform);
                const IconComponent = platformConfig?.icon || Code;
                
                return (
                  <div 
                    key={activity.id} 
                    className={`p-4 rounded-lg border cursor-pointer ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    } transition-colors`}
                    onClick={() => handleViewActivityDetail(activity)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                        <IconComponent className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'} truncate`}>
                          {activity.title}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'} mt-1 line-clamp-2`}>
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className={`text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700`}>
                            {activity.platform}
                          </span>
                          <div className="flex space-x-1">
                            {isConnected && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleMintAchievement(activity)}
                                className="h-6 w-6 p-0 text-orange-600 hover:bg-orange-50"
                              >
                                <Trophy className="h-3 w-3" />
                              </Button>
                            )}
                            {activity.url && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => window.open(activity.url, '_blank')}
                                className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-50"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Academic Activities Section */}
          <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    Academic Achievements
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    Research, publications, and academic excellence
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {activities.filter(a => a.category === 'academic').length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('academic')}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  View All
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.filter(a => a.category === 'academic').slice(0, 3).map((activity, index) => {
                const platformConfig = Object.values(platforms).flat().find(p => p.name === activity.platform);
                const IconComponent = platformConfig?.icon || BookOpen;
                
                return (
                  <div 
                    key={activity.id} 
                    className={`p-4 rounded-lg border cursor-pointer ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    } transition-colors`}
                    onClick={() => handleViewActivityDetail(activity)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'} truncate`}>
                          {activity.title}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'} mt-1 line-clamp-2`}>
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className={`text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700`}>
                            {activity.platform}
                          </span>
                          <div className="flex space-x-1">
                            {isConnected && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleMintAchievement(activity)}
                                className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-50"
                              >
                                <Trophy className="h-3 w-3" />
                              </Button>
                            )}
                            {activity.url && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => window.open(activity.url, '_blank')}
                                className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-50"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Extracurricular Activities Section */}
          <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    Extracurricular Activities
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    Clubs, sports, and community involvement
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {activities.filter(a => a.category === 'extracurricular').length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('extracurricular')}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  View All
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.filter(a => a.category === 'extracurricular').slice(0, 3).map((activity, index) => {
                const platformConfig = Object.values(platforms).flat().find(p => p.name === activity.platform);
                const IconComponent = platformConfig?.icon || Users;
                
                return (
                  <div 
                    key={activity.id} 
                    className={`p-4 rounded-lg border cursor-pointer ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    } transition-colors`}
                    onClick={() => handleViewActivityDetail(activity)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                        <IconComponent className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'} truncate`}>
                          {activity.title}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'} mt-1 line-clamp-2`}>
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className={`text-xs px-2 py-1 rounded-full bg-green-100 text-green-700`}>
                            {activity.platform}
                          </span>
                          <div className="flex space-x-1">
                            {isConnected && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleMintAchievement(activity)}
                                className="h-6 w-6 p-0 text-green-600 hover:bg-green-50"
                              >
                                <Trophy className="h-3 w-3" />
                              </Button>
                            )}
                            {activity.url && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => window.open(activity.url, '_blank')}
                                className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-50"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Professional Activities Section */}
          <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    Professional Experience
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    Internships, work experience, and career development
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  {activities.filter(a => a.category === 'professional').length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('professional')}
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  View All
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.filter(a => a.category === 'professional').slice(0, 3).map((activity, index) => {
                const platformConfig = Object.values(platforms).flat().find(p => p.name === activity.platform);
                const IconComponent = platformConfig?.icon || Briefcase;
                
                return (
                  <div 
                    key={activity.id} 
                    className={`p-4 rounded-lg border cursor-pointer ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    } transition-colors`}
                    onClick={() => handleViewActivityDetail(activity)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                        <IconComponent className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'} truncate`}>
                          {activity.title}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'} mt-1 line-clamp-2`}>
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className={`text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700`}>
                            {activity.platform}
                          </span>
                          <div className="flex space-x-1">
                            {isConnected && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleMintAchievement(activity)}
                                className="h-6 w-6 p-0 text-purple-600 hover:bg-purple-50"
                              >
                                <Trophy className="h-3 w-3" />
                              </Button>
                            )}
                            {activity.url && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => window.open(activity.url, '_blank')}
                                className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-50"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Creative Activities Section */}
          <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Paintbrush className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    Creative Projects
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    Art, design, music, and creative endeavors
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                  {activities.filter(a => a.category === 'creative').length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('creative')}
                  className="text-pink-600 border-pink-200 hover:bg-pink-50"
                >
                  View All
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.filter(a => a.category === 'creative').slice(0, 3).map((activity, index) => {
                const platformConfig = Object.values(platforms).flat().find(p => p.name === activity.platform);
                const IconComponent = platformConfig?.icon || Paintbrush;
                
                return (
                  <div 
                    key={activity.id} 
                    className={`p-4 rounded-lg border cursor-pointer ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    } transition-colors`}
                    onClick={() => handleViewActivityDetail(activity)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                        <IconComponent className="h-5 w-5 text-pink-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'} truncate`}>
                          {activity.title}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'} mt-1 line-clamp-2`}>
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className={`text-xs px-2 py-1 rounded-full bg-pink-100 text-pink-700`}>
                            {activity.platform}
                          </span>
                          <div className="flex space-x-1">
                            {isConnected && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleMintAchievement(activity)}
                                className="h-6 w-6 p-0 text-pink-600 hover:bg-pink-50"
                              >
                                <Trophy className="h-3 w-3" />
                              </Button>
                            )}
                            {activity.url && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => window.open(activity.url, '_blank')}
                                className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-50"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Platform Integration - Compact Button */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <Button
              onClick={() => setShowPlatformConnectDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-5 w-5 mr-2" />
              Connect Platforms & Import Achievements
            </Button>
          </div>
        </div>

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

        {/* Blockchain Achievements Dialog */}
        <Dialog open={showBlockchainDialog} onOpenChange={setShowBlockchainDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-purple-600" />
                <span>My Blockchain Achievements</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {blockchainAchievements.length > 0 ? (
                blockchainAchievements.map((achievement, index) => (
                  <div key={achievement.id} className={`p-4 rounded-lg border ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-600'} mt-1`}>
                          {achievement.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            achievement.category === 'technical' ? 'bg-orange-100 text-orange-700' :
                            achievement.category === 'academic' ? 'bg-blue-100 text-blue-700' :
                            achievement.category === 'extracurricular' ? 'bg-green-100 text-green-700' :
                            achievement.category === 'professional' ? 'bg-purple-100 text-purple-700' :
                            'bg-pink-100 text-pink-700'
                          }`}>
                            {achievement.category}
                          </span>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                            Token ID: {achievement.nftTokenId}
                          </span>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                            {new Date(achievement.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerifyAchievement(achievement.nftTokenId)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Verify
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    No blockchain achievements yet
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    Mint your activities as NFTs to see them here
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setShowBlockchainDialog(false)}
                className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Activity Detail Dialog */}
        <Dialog open={showActivityDetailDialog} onOpenChange={setShowActivityDetailDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                {selectedActivity && (() => {
                  const platformConfig = Object.values(platforms).flat().find(p => p.name === selectedActivity.platform);
                  const IconComponent = platformConfig?.icon || Activity;
                  return <IconComponent className="h-6 w-6 text-blue-600" />;
                })()}
                <span>Activity Details</span>
              </DialogTitle>
            </DialogHeader>
            
            {selectedActivity && (
              <div className="space-y-6">
                {/* Activity Header */}
                <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        {selectedActivity.title}
                      </h2>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {selectedActivity.platform}
                        </span>
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          selectedActivity.category === 'technical' ? 'bg-orange-100 text-orange-700' :
                          selectedActivity.category === 'academic' ? 'bg-blue-100 text-blue-700' :
                          selectedActivity.category === 'extracurricular' ? 'bg-green-100 text-green-700' :
                          selectedActivity.category === 'professional' ? 'bg-purple-100 text-purple-700' :
                          'bg-pink-100 text-pink-700'
                        }`}>
                          {selectedActivity.category}
                        </span>
                        {selectedActivity.verified && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <Check className="h-4 w-4" />
                            <span className="text-xs font-medium">Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      {new Date(selectedActivity.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-slate-600'} leading-relaxed`}>
                    {selectedActivity.description}
                  </p>
                </div>

                {/* Activity Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      Achievement Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Type:</span>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                          {selectedActivity.type}
                        </span>
                      </div>
                      {selectedActivity.value && (
                        <div className="flex justify-between">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Value:</span>
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                            {selectedActivity.value}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Date:</span>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                          {new Date(selectedActivity.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Status:</span>
                        <span className={`text-sm font-medium ${selectedActivity.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                          {selectedActivity.verified ? 'Verified' : 'Pending Verification'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      Actions
                    </h3>
                    <div className="space-y-3">
                      {selectedActivity.url && (
                        <Button
                          onClick={() => window.open(selectedActivity.url, '_blank')}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Original
                        </Button>
                      )}
                      {isConnected && (
                        <Button
                          onClick={() => handleMintAchievement(selectedActivity)}
                          disabled={blockchainLoading}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          {blockchainLoading ? (
                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <Trophy className="h-4 w-4 mr-2" />
                          )}
                          Mint as NFT
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => setShowActivityDetailDialog(false)}
                        className="w-full"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Blockchain Status */}
                {isConnected && (
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-200'} border`}>
                    <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                      🔗 Blockchain Status
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-purple-200' : 'text-purple-700'}`}>
                      This achievement can be minted as an NFT to create a permanent, verifiable record on the blockchain.
                      Once minted, it cannot be altered or deleted, providing proof of your accomplishment.
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyActivitiesPage;
