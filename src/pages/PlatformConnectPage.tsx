import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ArrowLeft,
  Plus,
  Check,
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
  ExternalLink,
  Calendar,
  X,
  Activity,
  Trophy
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

const PlatformConnectPage: React.FC = () => {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [activities, setActivities] = React.useState<ActivityItem[]>([]);
  const [showProfileDropdown, setShowProfileDropdown] = React.useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = React.useState(false);
  const [showPlatformConnectDialog, setShowPlatformConnectDialog] = React.useState(false);
  const [selectedPlatform, setSelectedPlatform] = React.useState('');
  const [platformUsername, setPlatformUsername] = React.useState('');
  const [isLoadingPlatform, setIsLoadingPlatform] = React.useState(false);
  const [showBulkImport, setShowBulkImport] = React.useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<string[]>([]);
  const [syncStatus, setSyncStatus] = React.useState<Record<string, 'idle' | 'syncing' | 'success' | 'error'>>({});
  const [showAnalytics, setShowAnalytics] = React.useState(false);
  const [platformStats, setPlatformStats] = React.useState<Record<string, any>>({});
  const [isLoadingStats, setIsLoadingStats] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);
  const [showGoalsDialog, setShowGoalsDialog] = React.useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('');


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
      { name: 'Academic Contests', icon: Target, color: 'text-red-600' }
    ],
    extracurricular: [
      { name: 'Sports', icon: Zap, color: 'text-green-600' },
      { name: 'Clubs', icon: Users, color: 'text-purple-600' },
      { name: 'Volunteering', icon: Heart, color: 'text-pink-600' },
      { name: 'Events', icon: Calendar, color: 'text-orange-600' }
    ],
    professional: [
      { name: 'Internships', icon: Briefcase, color: 'text-blue-700' },
      { name: 'Work Experience', icon: Briefcase, color: 'text-indigo-700' },
      { name: 'Certifications', icon: Award, color: 'text-yellow-700' },
      { name: 'Networking', icon: Users, color: 'text-purple-700' }
    ],
    creative: [
      { name: 'Art', icon: Paintbrush, color: 'text-pink-500' },
      { name: 'Music', icon: Music, color: 'text-purple-500' },
      { name: 'Writing', icon: PenTool, color: 'text-blue-500' },
      { name: 'Photography', icon: Camera, color: 'text-gray-600' }
    ]
  };

  // Mock activities data
  React.useEffect(() => {
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        platform: 'LeetCode',
        type: 'Contest',
        title: 'Weekly Contest 300',
        description: 'Solved 3 out of 4 problems',
        date: '2024-01-15',
        value: '1500 points',
        verified: true,
        category: 'technical'
      },
      {
        id: '2',
        platform: 'GitHub',
        type: 'Contribution',
        title: 'Open Source Project',
        description: 'Contributed to React.js repository',
        date: '2024-01-10',
        value: '5 commits',
        verified: true,
        category: 'technical'
      }
    ];
    setActivities(mockActivities);
  }, []);

  const handleConnectPlatform = async (platformName: string) => {
    setSelectedPlatform(platformName);
    setShowPlatformConnectDialog(true);
  };

  // Real API integration functions
  const fetchCodeforcesData = async (username: string) => {
    try {
      const [userInfoResponse, userStatusResponse] = await Promise.all([
        fetch(`https://codeforces.com/api/user.info?handles=${username}`),
        fetch(`https://codeforces.com/api/user.status?handle=${username}`)
      ]);
      
      const userInfo = await userInfoResponse.json();
      const userStatus = await userStatusResponse.json();
      
      if (userInfo.status === 'OK' && userStatus.status === 'OK') {
        const user = userInfo.result[0];
        const submissions = userStatus.result;
        
        const solvedProblems = submissions.filter((sub: any) => sub.verdict === 'OK');
        const contests = submissions.filter((sub: any) => sub.author.participantType === 'CONTESTANT');
        
        return {
          rating: user.rating || 0,
          maxRating: user.maxRating || 0,
          rank: user.rank || 'unrated',
          solvedProblems: solvedProblems.length,
          contests: contests.length,
          submissions: submissions.length
        };
      }
      throw new Error('Failed to fetch Codeforces data');
    } catch (error) {
      console.error('Codeforces API error:', error);
      throw error;
    }
  };

  const fetchCodewarsData = async (username: string) => {
    try {
      const response = await fetch(`https://www.codewars.com/api/v1/users/${username}`);
      const data = await response.json();
      
      if (data.success !== false) {
        return {
          username: data.username,
          honor: data.honor,
          leaderboardPosition: data.leaderboardPosition,
          totalCompleted: data.codeChallenges.totalCompleted,
          totalAuthored: data.codeChallenges.totalAuthored,
          ranks: data.ranks
        };
      }
      throw new Error('Failed to fetch Codewars data');
    } catch (error) {
      console.error('Codewars API error:', error);
      throw error;
    }
  };

  const fetchLeetCodeData = async (username: string) => {
    try {
      const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        return {
          totalSolved: data.totalSolved,
          easySolved: data.easySolved,
          mediumSolved: data.mediumSolved,
          hardSolved: data.hardSolved,
          acceptanceRate: data.acceptanceRate,
          ranking: data.ranking,
          contributionPoints: data.contributionPoints
        };
      }
      throw new Error('Failed to fetch LeetCode data');
    } catch (error) {
      console.error('LeetCode API error:', error);
      throw error;
    }
  };

  const handleImportActivities = async () => {
    if (!platformUsername.trim()) {
      alert('Please enter your username');
      return;
    }

    setIsLoadingPlatform(true);
    setSyncStatus(prev => ({ ...prev, [selectedPlatform]: 'syncing' }));
    
    try {
      let platformData: any = {};
      let newActivities: ActivityItem[] = [];

      console.log(`Attempting to fetch data for ${selectedPlatform} with username: ${platformUsername}`);

      // Fetch data based on platform
      switch (selectedPlatform) {
        case 'Codeforces':
          platformData = await fetchCodeforcesData(platformUsername);
          console.log('Codeforces data:', platformData);
          newActivities = [
            {
              id: Date.now().toString(),
              platform: 'Codeforces',
              type: 'Contest',
              title: `Codeforces Profile - ${platformData.rank}`,
              description: `Rating: ${platformData.rating}, Solved: ${platformData.solvedProblems} problems`,
              date: new Date().toISOString().split('T')[0],
              value: `${platformData.rating} rating`,
              verified: true,
              category: 'technical'
            }
          ];
          break;
        case 'Codewars':
          platformData = await fetchCodewarsData(platformUsername);
          console.log('Codewars data:', platformData);
          newActivities = [
            {
              id: Date.now().toString(),
              platform: 'Codewars',
              type: 'Kata',
              title: `Codewars Profile - ${platformData.ranks?.overall?.name || '8 kyu'}`,
              description: `Honor: ${platformData.honor}, Completed: ${platformData.totalCompleted} katas`,
              date: new Date().toISOString().split('T')[0],
              value: `${platformData.honor} honor`,
              verified: true,
              category: 'technical'
            }
          ];
          break;
        case 'LeetCode':
          platformData = await fetchLeetCodeData(platformUsername);
          console.log('LeetCode data:', platformData);
          newActivities = [
            {
              id: Date.now().toString(),
              platform: 'LeetCode',
              type: 'Problems',
              title: `LeetCode Profile - ${platformData.totalSolved} solved`,
              description: `Easy: ${platformData.easySolved}, Medium: ${platformData.mediumSolved}, Hard: ${platformData.hardSolved}`,
              date: new Date().toISOString().split('T')[0],
              value: `${platformData.totalSolved} problems`,
              verified: true,
              category: 'technical'
            }
          ];
          break;
        default:
          // Fallback for other platforms
          platformData = { message: 'Demo data' };
          newActivities = [
            {
              id: Date.now().toString(),
              platform: selectedPlatform,
              type: 'Achievement',
              title: `${selectedPlatform} Profile Import`,
              description: `Imported activities from ${selectedPlatform}`,
              date: new Date().toISOString().split('T')[0],
              value: '5 activities',
              verified: true,
              category: 'technical'
            }
          ];
      }
      
      console.log('Adding activities:', newActivities);
      setActivities(prev => [...prev, ...newActivities]);
      setPlatformStats(prev => ({ ...prev, [selectedPlatform]: platformData }));
      setSyncStatus(prev => ({ ...prev, [selectedPlatform]: 'success' }));
      setShowPlatformConnectDialog(false);
      setPlatformUsername('');
      setIsLoadingPlatform(false);
      alert(`Successfully imported activities from ${selectedPlatform}!\n\nAdded ${newActivities.length} activities to your profile.`);
    } catch (error) {
      console.error('Import error:', error);
      setSyncStatus(prev => ({ ...prev, [selectedPlatform]: 'error' }));
      setIsLoadingPlatform(false);
      alert(`Failed to import from ${selectedPlatform}.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease check your username and try again.`);
    }
  };

  // Bulk import functionality
  const handleBulkImport = async () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    setIsLoadingStats(true);
    const results = [];

    for (const platform of selectedPlatforms) {
      try {
        setSyncStatus(prev => ({ ...prev, [platform]: 'syncing' }));
        
        // For demo purposes, we'll use a single username for all platforms
        const username = platformUsername || 'demo_user';
        
        let platformData: any = {};
        switch (platform) {
          case 'Codeforces':
            platformData = await fetchCodeforcesData(username);
            break;
          case 'Codewars':
            platformData = await fetchCodewarsData(username);
            break;
          case 'LeetCode':
            platformData = await fetchLeetCodeData(username);
            break;
        }
        
        setPlatformStats(prev => ({ ...prev, [platform]: platformData }));
        setSyncStatus(prev => ({ ...prev, [platform]: 'success' }));
        results.push({ platform, success: true });
      } catch (error) {
        setSyncStatus(prev => ({ ...prev, [platform]: 'error' }));
        results.push({ platform, success: false, error });
      }
    }

    setIsLoadingStats(false);
    setShowBulkImport(false);
    
    const successCount = results.filter(r => r.success).length;
    alert(`Bulk import completed! ${successCount}/${selectedPlatforms.length} platforms imported successfully.`);
  };

  // Export functionality
  const exportToCSV = () => {
    const csvContent = [
      ['Platform', 'Title', 'Description', 'Date', 'Value', 'Verified', 'Category'],
      ...activities.map(activity => [
        activity.platform,
        activity.title,
        activity.description,
        activity.date,
        activity.value || '',
        activity.verified ? 'Yes' : 'No',
        activity.category
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `achievements-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // Simple PDF generation (in a real app, you'd use a library like jsPDF)
    const content = `
      ACHIEVEMENT PORTFOLIO
      Generated on: ${new Date().toLocaleDateString()}
      
      SUMMARY:
      - Total Activities: ${totalActivities}
      - Verified Activities: ${verifiedActivities}
      - Connected Platforms: ${connectedPlatforms}
      
      ACHIEVEMENTS:
      ${activities.map(activity => `
        Platform: ${activity.platform}
        Title: ${activity.title}
        Description: ${activity.description}
        Date: ${activity.date}
        Value: ${activity.value || 'N/A'}
        Verified: ${activity.verified ? 'Yes' : 'No'}
        Category: ${activity.category}
        ---
      `).join('')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `achievements-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const shareAchievements = () => {
    const text = `Check out my coding achievements! 🚀\n\n📊 Total Activities: ${totalActivities}\n✅ Verified: ${verifiedActivities}\n🔗 Platforms: ${connectedPlatforms}\n\n#Coding #Achievements #Portfolio`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Coding Achievements',
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Achievement summary copied to clipboard!');
    }
  };

  const totalActivities = activities.length;
  const verifiedActivities = activities.filter(a => a.verified).length;
  const connectedPlatforms = Object.keys(platformStats).length;

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
        isStudent={true}
      />

      <div className="pt-4 px-4 py-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/activities')}
              className={isDarkMode ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-800'}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                Connect Platforms
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                Import your achievements from various platforms and services
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => setShowBulkImport(true)}
              variant="outline"
              className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
            <Button
              onClick={() => setShowExportDialog(true)}
              variant="outline"
              className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-purple-200 text-purple-600 hover:bg-purple-50'}`}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button
              onClick={shareAchievements}
              variant="outline"
              className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-blue-200 text-blue-600 hover:bg-blue-50'}`}
            >
              <Users className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-gray-900 border-gray-700' : 'bg-gradient-to-br from-slate-50 to-blue-50 border-blue-200'} border`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                Platform Connection Overview
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                Track your achievements across multiple platforms
              </p>
            </div>
            <div className="flex space-x-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {connectedPlatforms}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  Connected
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {totalActivities}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  Activities
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  {verifiedActivities}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  Verified
                </div>
              </div>
            </div>
          </div>
          
          {/* Platform Status Grid */}
          {Object.keys(platformStats).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(platformStats).map(([platform, stats]) => (
                <div key={platform} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white/80 border-gray-200'} border`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      {platform}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {platform === 'Codeforces' && (
                      <>
                        <div className="text-sm text-gray-500">Rating: <span className="font-medium text-blue-600">{stats.rating}</span></div>
                        <div className="text-sm text-gray-500">Solved: <span className="font-medium text-green-600">{stats.solvedProblems}</span></div>
                      </>
                    )}
                    {platform === 'Codewars' && (
                      <>
                        <div className="text-sm text-gray-500">Honor: <span className="font-medium text-purple-600">{stats.honor}</span></div>
                        <div className="text-sm text-gray-500">Katas: <span className="font-medium text-green-600">{stats.totalCompleted}</span></div>
                      </>
                    )}
                    {platform === 'LeetCode' && (
                      <>
                        <div className="text-sm text-gray-500">Solved: <span className="font-medium text-orange-600">{stats.totalSolved}</span></div>
                        <div className="text-sm text-gray-500">Rate: <span className="font-medium text-blue-600">{stats.acceptanceRate}%</span></div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


        {/* Current Activities Display */}
        {activities.length > 0 && (
          <div className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/30' : 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200'} border`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Imported Activities
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  {activities.length} activities successfully imported from various platforms
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                  <span className="text-sm font-medium">{activities.length} Total</span>
                </div>
                <div className={`px-3 py-1 rounded-full ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                  <span className="text-sm font-medium">{activities.filter(a => a.verified).length} Verified</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.map((activity) => {
                const platformConfig = Object.values(platforms).flat().find(p => p.name === activity.platform);
                const IconComponent = platformConfig?.icon || Code;
                
                return (
                  <Card key={activity.id} className={`transition-all duration-200 hover:shadow-lg ${isDarkMode ? 'bg-gray-800/50 border-gray-600' : 'bg-white/80 border-gray-200'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${platformConfig?.color || 'text-blue-500'}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'} truncate`}>
                            {activity.title}
                          </h4>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'} mt-1 line-clamp-2`}>
                            {activity.description}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600'}`}
                            >
                              {activity.platform}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              {activity.verified && (
                                <Check className="h-3 w-3 text-green-500" />
                              )}
                              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                                {activity.value}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Platform Categories */}
        <div className="space-y-8">
          {Object.entries(platforms).map(([category, platformList]) => (
            <div key={category} className={`rounded-2xl p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-xl font-bold capitalize ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    {category} Platforms
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    Connect your {category} achievements and activities
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-xs">
                    {platformList.length} platforms
                  </Badge>
                  <Button
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowAnalyticsDialog(true);
                    }}
                    variant="outline"
                    size="sm"
                    className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-blue-200 text-blue-600 hover:bg-blue-50'}`}
                  >
                    <Target className="h-4 w-4 mr-1" />
                    Analytics
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {platformList.map((platform) => {
                  const IconComponent = platform.icon;
                  const isConnected = activities.some(a => a.platform === platform.name);
                  
                  return (
                    <Card key={platform.name} className={`transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                      isConnected 
                        ? `${isDarkMode ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/20 border-green-400 shadow-green-500/20' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-green-200/50'}` 
                        : `${isDarkMode ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50' : 'bg-gray-50/80 border-gray-200 hover:bg-gray-100/80'}`
                    }`}>
                      <CardContent className="p-4">
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
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600">
                                {activities.filter(a => a.platform === platform.name).length} activities
                              </span>
                            </div>
                            {syncStatus[platform.name] && (
                              <div className="flex items-center space-x-2">
                                {syncStatus[platform.name] === 'syncing' && (
                                  <>
                                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                                    <span className="text-xs text-blue-600">Syncing...</span>
                                  </>
                                )}
                                {syncStatus[platform.name] === 'success' && (
                                  <>
                                    <Check className="h-3 w-3 text-green-500" />
                                    <span className="text-xs text-green-600">Synced</span>
                                  </>
                                )}
                                {syncStatus[platform.name] === 'error' && (
                                  <>
                                    <X className="h-3 w-3 text-red-500" />
                                    <span className="text-xs text-red-600">Error</span>
                                  </>
                                )}
                              </div>
                            )}
                            {platformStats[platform.name] && (
                              <div className="text-xs text-gray-500">
                                {platform.name === 'Codeforces' && `Rating: ${platformStats[platform.name].rating}`}
                                {platform.name === 'Codewars' && `Honor: ${platformStats[platform.name].honor}`}
                                {platform.name === 'LeetCode' && `Solved: ${platformStats[platform.name].totalSolved}`}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConnectPlatform(platform.name)}
                            className="w-full"
                            disabled={syncStatus[platform.name] === 'syncing'}
                          >
                            {syncStatus[platform.name] === 'syncing' ? (
                              <>
                                <div className="h-3 w-3 mr-2 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                                Connecting...
                              </>
                            ) : (
                              'Connect'
                            )}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Platform Connection Dialog */}
        <Dialog open={showPlatformConnectDialog} onOpenChange={setShowPlatformConnectDialog}>
          <DialogContent className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? 'text-white' : 'text-slate-800'}>
                Connect {selectedPlatform}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className={isDarkMode ? 'text-gray-300' : 'text-slate-700'}>
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder={`Enter your ${selectedPlatform} username`}
                  value={platformUsername}
                  onChange={(e) => setPlatformUsername(e.target.value)}
                  className={`mt-1 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleImportActivities}
                  disabled={isLoadingPlatform}
                  className="flex-1"
                >
                  {isLoadingPlatform ? 'Importing...' : 'Import Activities'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPlatformConnectDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Analytics Dashboard Dialog */}
        <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
          <DialogContent className={`max-w-4xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? 'text-white' : 'text-slate-800'}>
                Platform Analytics Dashboard
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    Connected Platforms
                  </h4>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {connectedPlatforms}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    Total Activities
                  </h4>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {totalActivities}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    Verified Activities
                  </h4>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {verifiedActivities}
                  </p>
                </div>
              </div>

              {/* Platform Stats */}
              {Object.keys(platformStats).length > 0 && (
                <div>
                  <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    Platform Statistics
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(platformStats).map(([platform, stats]) => (
                      <div key={platform} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                        <h5 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                          {platform}
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                          {Object.entries(stats).map(([key, value]) => (
                            <div key={key}>
                              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                              </span>
                              <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Bulk Import Dialog */}
        <Dialog open={showBulkImport} onOpenChange={setShowBulkImport}>
          <DialogContent className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? 'text-white' : 'text-slate-800'}>
                Bulk Import from Multiple Platforms
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : 'text-slate-700'}>
                  Select Platforms
                </Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Object.values(platforms).flat().map((platform) => (
                    <div key={platform.name} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={platform.name}
                        checked={selectedPlatforms.includes(platform.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPlatforms(prev => [...prev, platform.name]);
                          } else {
                            setSelectedPlatforms(prev => prev.filter(p => p !== platform.name));
                          }
                        }}
                        className="rounded"
                      />
                      <label htmlFor={platform.name} className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                        {platform.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="bulk-username" className={isDarkMode ? 'text-gray-300' : 'text-slate-700'}>
                  Username (for all platforms)
                </Label>
                <Input
                  id="bulk-username"
                  placeholder="Enter your username"
                  value={platformUsername}
                  onChange={(e) => setPlatformUsername(e.target.value)}
                  className={`mt-1 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleBulkImport}
                  disabled={isLoadingStats || selectedPlatforms.length === 0}
                  className="flex-1"
                >
                  {isLoadingStats ? 'Importing...' : 'Import All'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowBulkImport(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Export Dialog */}
        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <DialogContent className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? 'text-white' : 'text-slate-800'}>
                Export Your Achievements
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'} mb-4`}>
                  Export your achievements in various formats for sharing and analysis
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      CSV Export
                    </h4>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'} mb-3`}>
                      Download as spreadsheet for data analysis
                    </p>
                    <Button onClick={exportToCSV} className="w-full" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Download CSV
                    </Button>
                  </div>
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      Text Export
                    </h4>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'} mb-3`}>
                      Download as text file for documentation
                    </p>
                    <Button onClick={exportToPDF} className="w-full" size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Download TXT
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowExportDialog(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Beautiful Analytics Dialog */}
        <Dialog open={showAnalyticsDialog} onOpenChange={setShowAnalyticsDialog}>
          <DialogContent className={`max-w-4xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Analytics
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {(() => {
                const categoryActivities = activities.filter(a => a.category === selectedCategory);
                const categoryStats = Object.entries(platformStats).filter(([platform, stats]) => 
                  platforms[selectedCategory as keyof typeof platforms]?.some(p => p.name === platform)
                );
                const verifiedCount = categoryActivities.filter(a => a.verified).length;
                const verificationRate = categoryActivities.length > 0 ? Math.round((verifiedCount / categoryActivities.length) * 100) : 0;

                return (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-500/30' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'} border`}>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <Activity className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                              {categoryActivities.length}
                            </p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                              Total Activities
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/30' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'} border`}>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-500 rounded-lg">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                              {verifiedCount}
                            </p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                              Verified ({verificationRate}%)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'} border`}>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-500 rounded-lg">
                            <Target className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                              {categoryStats.length}
                            </p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                              Connected Platforms
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-500/30' : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'} border`}>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-500 rounded-lg">
                            <Trophy className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className={`text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                              {Math.round(categoryActivities.length / Math.max(categoryStats.length, 1))}
                            </p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                              Avg per Platform
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Platform Details */}
                    {categoryStats.length > 0 && (
                      <div>
                        <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                          Platform Performance
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {categoryStats.map(([platform, stats]) => {
                            const platformConfig = platforms[selectedCategory as keyof typeof platforms]?.find(p => p.name === platform);
                            const IconComponent = platformConfig?.icon || Code;
                            
                            return (
                              <div key={platform} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className={`p-2 rounded-lg ${platformConfig?.color || 'text-blue-500'}`}>
                                    <IconComponent className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <h5 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                      {platform}
                                    </h5>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  {platform === 'Codeforces' && (
                                    <>
                                      <div className="flex justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Rating:</span>
                                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{stats.rating}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Solved:</span>
                                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{stats.solvedProblems}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Contests:</span>
                                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{stats.contests}</span>
                                      </div>
                                    </>
                                  )}
                                  {platform === 'Codewars' && (
                                    <>
                                      <div className="flex justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Honor:</span>
                                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{stats.honor}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Katas:</span>
                                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{stats.totalCompleted}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Rank:</span>
                                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{stats.ranks?.overall?.name || 'N/A'}</span>
                                      </div>
                                    </>
                                  )}
                                  {platform === 'LeetCode' && (
                                    <>
                                      <div className="flex justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Solved:</span>
                                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{stats.totalSolved}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Easy:</span>
                                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{stats.easySolved}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Medium:</span>
                                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{stats.mediumSolved}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Hard:</span>
                                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{stats.hardSolved}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Acceptance:</span>
                                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{stats.acceptanceRate}%</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Recent Activities */}
                    {categoryActivities.length > 0 && (
                      <div>
                        <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                          Recent Activities
                        </h4>
                        <div className="space-y-2">
                          {categoryActivities.slice(0, 5).map((activity) => (
                            <div key={activity.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} border`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                    {activity.title}
                                  </p>
                                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                                    {activity.description}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    {activity.platform}
                                  </Badge>
                                  {activity.verified && (
                                    <Check className="h-4 w-4 text-green-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PlatformConnectPage;
