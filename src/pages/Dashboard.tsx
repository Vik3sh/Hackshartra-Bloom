import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Monitor, MessageSquare, PlayCircle, Video, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Gift, Flame, Leaf } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import CustomEcoTree from '@/components/tree/CustomEcoTree';
import ErrorBoundary from '@/components/ErrorBoundary';
import EnvironmentalQuiz from '@/components/quiz/EnvironmentalQuiz';
import ModuleSelector from '@/components/quiz/ModuleSelector';
import ChallengeGrid from '@/components/challenges/ChallengeGrid';
import ChallengeDetailModal from '@/components/challenges/ChallengeDetailModal';
import UnifiedLessonSystem from '@/components/lessons/UnifiedLessonSystem';
import LessonContent from '@/components/lessons/LessonContent';
import RewardMap from '@/components/rewards/RewardMap';
import NewsSection from '@/components/news/NewsSection';
import GameModal from '@/components/rpg/GameModal';
import Profile from '@/components/profile/Profile';
import SimpleEnhancedDashboard from '@/components/dashboard/SimpleEnhancedDashboard';
import CommunityFeed from '@/components/community/CommunityFeed';
import QuizPage from '@/pages/QuizPage';
import WelcomeQuiz from '@/components/onboarding/WelcomeQuiz';
import DeveloperMode from '@/components/dev/DeveloperMode';
import DevModeTest from '@/components/dev/DevModeTest';
import GameTest from '@/components/dev/GameTest';
import { QuizModule } from '@/data/quizData';
import { Challenge, getUnlockedChallenges } from '@/data/challenges';
import { Lesson } from '@/data/lessons';
import { Game, Boss } from '@/data/rpgLessons';
import { LessonQuest, LessonBoss } from '@/data/lessonQuests';
import { useProgress } from '@/contexts/ProgressContext';
import { useLessonProgression } from '@/contexts/LessonProgressionContext';
import { useToast } from '@/contexts/ToastContext';

const AvatarStack: React.FC<{ names: string[] }> = ({ names }) => (
  <div className="flex -space-x-2">
    {names.map((n, i) => (
      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white text-xs font-semibold flex items-center justify-center ring-2 ring-white">
        {n[0]}
      </div>
    ))}
  </div>
);

const ActivityBars: React.FC = () => {
  const data = [24, 32, 28, 22, 48, 18, 26];
  const max = Math.max(...data);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <div>
      <div className="flex items-end justify-between gap-3 h-40">
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className="relative w-full">
              <div className="h-36 w-full rounded-xl bg-gradient-to-b from-purple-100 to-purple-50" />
              <div
                className="absolute bottom-0 left-0 right-0 mx-auto w-full rounded-xl bg-gradient-to-t from-purple-600 to-indigo-500"
                style={{ height: `${(v / max) * 100}%` }}
              />
            </div>
            <span className="mt-2 text-xs text-muted-foreground">{days[i]}</span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="rounded-2xl border bg-white p-4">
          <h4 className="text-sm font-medium mb-3">By platform</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-slate-600" />
                <span>EcoEdu platform</span>
              </div>
              <span className="text-slate-600">12.5 h</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-slate-600" />
                <span>Zoom</span>
              </div>
              <span className="text-slate-600">6.8 h</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-slate-600" />
                <span>Google Meet</span>
              </div>
              <span className="text-slate-600">4.2 h</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-slate-600" />
                <span>Skype</span>
              </div>
              <span className="text-slate-600">2.5 h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [selectedModule, setSelectedModule] = useState<QuizModule | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showChallengeDetail, setShowChallengeDetail] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showLessonDetail, setShowLessonDetail] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [showBossModal, setShowBossModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<LessonQuest | null>(null);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [selectedLessonBoss, setSelectedLessonBoss] = useState<LessonBoss | null>(null);
  const [showLessonBossModal, setShowLessonBossModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showWelcomeQuiz, setShowWelcomeQuiz] = useState(false);
  const [showDeveloperMode, setShowDeveloperMode] = useState(false);
  const [showLessonContent, setShowLessonContent] = useState(false);

  const { profile } = useProfile();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { userProgress, completeChallenge, completeLesson, completeGame, addItems } = useProgress();
  const { lessonProgress, completeLesson: completeLessonProgression, getModuleProgress } = useLessonProgression();
  const { showToast } = useToast();

  // Check if user is new and show welcome quiz
  React.useEffect(() => {
    const hasCompletedWelcomeQuiz = localStorage.getItem('welcomeQuizCompleted');
    const hasAnyProgress = userProgress.totalPoints > 0 || 
                          (userProgress.inventory?.items && Object.values(userProgress.inventory.items).some(count => count > 0));
    
    if (!hasCompletedWelcomeQuiz && !hasAnyProgress) {
      setShowWelcomeQuiz(true);
    }
  }, [userProgress]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      localStorage.removeItem('ecoLearnProgress');
      localStorage.removeItem('completedQuizzes');
      localStorage.removeItem('completedChallenges');
      localStorage.removeItem('completedLessons');
      localStorage.removeItem('completedGames');
      localStorage.removeItem('completedSubLevels');
      localStorage.removeItem('completedMajorLevels');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleModuleSelect = (module: QuizModule) => {
    setSelectedModule(module);
    setShowQuiz(true);
  };

  const handleQuizComplete = (quizId: string, score: number) => {
    console.log(`Quiz ${quizId} completed with score: ${score}`);
    setShowQuiz(false);
    setSelectedModule(null);
  };

  const handleQuizClose = () => {
    setShowQuiz(false);
    setSelectedModule(null);
  };

  const handleStartChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setShowChallengeDetail(true);
  };

  const handleCompleteChallenge = (challengeId: string) => {
    console.log(`Challenge ${challengeId} completed`);
    
    // Much more conservative challenge rewards
    const getChallengeRewards = (challengeId: string) => {
      const baseRewards = {
        water: 1,
        sunlight: 1,
        nutrients: 1,
        fertilizer: 0,
        love: 0
      };

      // Small difficulty-based bonuses
      if (challengeId.includes('easy')) {
        return baseRewards;
      } else if (challengeId.includes('medium')) {
        return {
          ...baseRewards,
          water: 2,
          sunlight: 2,
          nutrients: 1,
          fertilizer: 1
        };
      } else if (challengeId.includes('hard')) {
        return {
          ...baseRewards,
          water: 2,
          sunlight: 2,
          nutrients: 2,
          fertilizer: 1,
          love: 1
        };
      }

      return baseRewards;
    };

    const challengeRewards = getChallengeRewards(challengeId);
    const xpReward = 100; // Much lower XP for challenges
    
    // Complete challenge with enhanced rewards
    completeChallenge(challengeId, xpReward, challengeRewards);
    addItems(challengeRewards);
    
    // Show challenge completion notification
    showToast({
      type: 'challenge',
      title: '🏆 Challenge Completed!',
      message: 'Excellent! You made a real-world impact!',
      rewards: challengeRewards,
      xp: xpReward,
      duration: 6000
    });
    
    setShowChallengeDetail(false);
    setSelectedChallenge(null);
  };

  const handleChallengeDetailClose = () => {
    setShowChallengeDetail(false);
    setSelectedChallenge(null);
  };

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowLessonContent(true);
  };

  const handleCompleteLesson = (lessonId: string) => {
    console.log(`Lesson ${lessonId} completed`);
    
    // Get module ID for progression system
    const getModuleId = (lessonId: string): string => {
      if (lessonId.startsWith('climate-')) return 'climate-change';
      if (lessonId.startsWith('waste-')) return 'waste-management';
      if (lessonId.startsWith('energy-')) return 'renewable-energy';
      if (lessonId.startsWith('conservation-')) return 'conservation';
      return 'climate-change';
    };

    const moduleId = getModuleId(lessonId);
    
    // Complete lesson in progression system
    completeLessonProgression(lessonId, moduleId);
    
    // Enhanced reward system based on lesson number and module
    const getLessonRewards = (lessonId: string, moduleId: string) => {
      // Extract lesson number (e.g., climate-3 -> 3)
      const lessonNumber = parseInt(lessonId.split('-')[1]) || 1;
      
      // Much more conservative base rewards - progression should be meaningful
      const baseRewards = {
        water: Math.max(1, Math.floor(lessonNumber / 2)), // 1 water every 2 lessons
        sunlight: Math.max(1, Math.floor(lessonNumber / 2)), // 1 sunlight every 2 lessons
        nutrients: Math.max(0, Math.floor(lessonNumber / 3)), // 1 nutrient every 3 lessons
        fertilizer: Math.max(0, Math.floor(lessonNumber / 4)), // 1 fertilizer every 4 lessons
        love: Math.max(0, Math.floor(lessonNumber / 5)) // 1 love every 5 lessons
      };

      // Small module-specific bonuses (only +1)
      if (moduleId === 'climate-change') {
        return { ...baseRewards, water: baseRewards.water + 1 };
      } else if (moduleId === 'waste-management') {
        return { ...baseRewards, nutrients: baseRewards.nutrients + 1 };
      } else if (moduleId === 'renewable-energy') {
        return { ...baseRewards, sunlight: baseRewards.sunlight + 1 };
      } else if (moduleId === 'conservation') {
        return { ...baseRewards, fertilizer: baseRewards.fertilizer + 1, love: baseRewards.love + 1 };
      }

      return baseRewards;
    };

    const lessonRewards = getLessonRewards(lessonId, moduleId);
    
    // Calculate XP based on lesson number - much more conservative
    const lessonNumber = parseInt(lessonId.split('-')[1]) || 1;
    const xpReward = 50 + (lessonNumber * 25); // Much lower XP rewards
    
    // Update both contexts
    completeLesson(lessonId, xpReward, lessonRewards);
    addItems(lessonRewards);
    
    // Check if module is completed
    const moduleProgress = getModuleProgress(moduleId);
    if (moduleProgress === 100) {
      // Module completion bonus - much smaller
      const moduleBonus = {
        water: 2,
        sunlight: 2,
        nutrients: 1,
        fertilizer: 1,
        love: 1
      };
      
      addItems(moduleBonus);
      
      // Show module completion notification
      showToast({
        type: 'module',
        title: '🎉 Module Completed!',
        message: 'Congratulations! You\'ve completed an entire module!',
        rewards: moduleBonus,
        xp: 200, // Much lower XP bonus
        duration: 8000
      });
    }
    
    // Show lesson completion notification
    showToast({
      type: 'lesson',
      title: '✅ Lesson Completed!',
      message: 'Great job! Keep up the learning!',
      rewards: lessonRewards,
      xp: xpReward,
      duration: 5000
    });
    
    // Close lesson content
    setShowLessonContent(false);
    setSelectedLesson(null);
  };

  const handleLessonDetailClose = () => {
    setShowLessonDetail(false);
    setSelectedLesson(null);
  };

  const handleStartGame = (game: Game) => {
    setSelectedGame(game);
    setShowGameModal(true);
  };

  const handleCompleteGame = (gameId: string) => {
    console.log(`Game ${gameId} completed`);
    
    // Much more conservative game rewards
    const getGameRewards = (gameId: string) => {
      const baseRewards = {
        water: 1,
        sunlight: 1,
        nutrients: 1,
        fertilizer: 0,
        love: 0
      };

      // Small game-specific bonuses
      if (gameId.includes('waste-sorting')) {
        return { ...baseRewards, nutrients: 2 };
      } else if (gameId.includes('temperature-rising')) {
        return { ...baseRewards, water: 2 };
      } else if (gameId.includes('greenhouse-puzzle')) {
        return { ...baseRewards, sunlight: 2, nutrients: 1 };
      }

      return baseRewards;
    };

    const gameRewards = getGameRewards(gameId);
    const xpReward = 75; // Much lower XP for games
    
    // Complete game with enhanced rewards
    completeGame(gameId, xpReward, gameRewards);
    addItems(gameRewards);
    
    // Show game completion notification
    showToast({
      type: 'game',
      title: '🎮 Game Completed!',
      message: 'Awesome! You mastered that game!',
      rewards: gameRewards,
      xp: xpReward,
      duration: 5000
    });
    
    setShowGameModal(false);
    setSelectedGame(null);
  };

  const handleGameModalClose = () => {
    setShowGameModal(false);
    setSelectedGame(null);
  };

  const handleStartBoss = (boss: Boss) => {
    setSelectedBoss(boss);
    setShowBossModal(true);
  };

  const handleCompleteBoss = (bossId: string) => {
    console.log(`Boss ${bossId} completed`);
    setShowBossModal(false);
    setSelectedBoss(null);
  };

  const handleBossModalClose = () => {
    setShowBossModal(false);
    setSelectedBoss(null);
  };

  const handleStartQuest = (quest: LessonQuest) => {
    setSelectedQuest(quest);
    setShowQuestModal(true);
  };

  const handleCompleteQuest = (questId: string) => {
    console.log(`Quest ${questId} completed`);
    setShowQuestModal(false);
    setSelectedQuest(null);
  };

  const handleQuestModalClose = () => {
    setShowQuestModal(false);
    setSelectedQuest(null);
  };

  const handleStartLessonBoss = (boss: LessonBoss) => {
    setSelectedLessonBoss(boss);
    setShowLessonBossModal(true);
  };

  const handleCompleteLessonBoss = (bossId: string) => {
    console.log(`Lesson Boss ${bossId} completed`);
    setShowLessonBossModal(false);
    setSelectedLessonBoss(null);
  };

  const handleLessonBossModalClose = () => {
    setShowLessonBossModal(false);
    setSelectedLessonBoss(null);
  };

  const handleWelcomeQuizComplete = () => {
    localStorage.setItem('welcomeQuizCompleted', 'true');
    setShowWelcomeQuiz(false);
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] parallax-container">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-xl fixed top-4 left-2 right-2 z-50 rounded-2xl border border-white/20 navbar-3d navbar-shadow navbar-curved navbar-floating navbar-glass">
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">
                EcoEdu Punjab
              </h1>
            </div>

            {/* Centered Navigation */}
            <div className="flex-1 flex justify-center">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-gray-100 rounded-full p-0.5 [&>button]:rounded-none [&>button]:first:rounded-l-full [&>button]:last:rounded-r-full [&>button]:not(:first-child):not(:last-child):rounded-none">
                  <TabsTrigger 
                    value="dashboard" 
                    className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2 transition-all duration-300 ease-in-out hover:bg-gray-200"
                  >
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger 
                    value="lessons" 
                    className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2 transition-all duration-300 ease-in-out hover:bg-gray-200"
                  >
                    Lessons
                  </TabsTrigger>
                  <TabsTrigger 
                    value="challenges" 
                    className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2 transition-all duration-300 ease-in-out hover:bg-gray-200"
                  >
                    Challenges
                  </TabsTrigger>
                  <TabsTrigger 
                    value="community" 
                    className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2 transition-all duration-300 ease-in-out hover:bg-gray-200"
                  >
                    Community
                  </TabsTrigger>
                  <TabsTrigger 
                    value="news" 
                    className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2 transition-all duration-300 ease-in-out hover:bg-gray-200"
                  >
                    News
                  </TabsTrigger>
                  <TabsTrigger 
                    value="quiz" 
                    className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2 transition-all duration-300 ease-in-out hover:bg-gray-200"
                  >
                    Quiz
                  </TabsTrigger>
                  <TabsTrigger 
                    value="rewards" 
                    className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2 transition-all duration-300 ease-in-out hover:bg-gray-200"
                  >
                    Rewards
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Right Section - User Actions */}
            <div className="flex items-center space-x-4">
              {/* Calendar Icon */}
              <div className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 cursor-pointer">
                <Calendar className="w-5 h-5" />
              </div>
              
              {/* User Avatar */}
              <div 
                className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                onClick={() => setShowProfile(true)}
              >
                {profile?.pokemon_avatar ? (
                  <img 
                    src={profile.pokemon_avatar} 
                    alt="User Avatar" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 text-sm font-medium">K</span>
                  </div>
                )}
              </div>
              
              {/* Developer Mode Button */}
              <Button
                onClick={() => setShowDeveloperMode(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-xs rounded-full"
                title="Developer Mode"
              >
                🛠️ DEV
              </Button>
              
              {/* Logout Button */}
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-full px-4 py-2"
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging out...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-2 py-6 pt-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="dashboard" className="mt-6">
            <SimpleEnhancedDashboard 
              userProgress={userProgress}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          </TabsContent>

          <TabsContent value="lessons" className="mt-6">
            <div className="max-w-6xl mx-auto">
              <UnifiedLessonSystem
                onStartLesson={handleStartLesson}
                onStartGame={handleStartGame}
                onStartBoss={handleStartBoss}
                onStartQuest={handleStartQuest}
                onStartLessonBoss={handleStartLessonBoss}
              />
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="mt-6">
            <div className="max-w-6xl mx-auto">
              <ChallengeGrid
                challenges={getUnlockedChallenges(userProgress.level, userProgress.completedChallengeIds)}
                onStartChallenge={(challengeId: string) => {
                  const challenge = getUnlockedChallenges(userProgress.level, userProgress.completedChallengeIds).find(c => c.id === challengeId);
                  if (challenge) handleStartChallenge(challenge);
                }}
                onCompleteChallenge={handleCompleteChallenge}
                userLevel={userProgress.level}
              />
            </div>
          </TabsContent>


          <TabsContent value="community" className="mt-6">
            <div className="max-w-6xl mx-auto">
              <CommunityFeed />
            </div>
          </TabsContent>

          <TabsContent value="news" className="mt-6">
            <div className="max-w-6xl mx-auto">
              <NewsSection />
            </div>
          </TabsContent>

          <TabsContent value="quiz" className="mt-6">
            <QuizPage />
          </TabsContent>

          <TabsContent value="rewards" className="mt-6">
            <div className="max-w-6xl mx-auto">
              <RewardMap />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      {showQuiz && selectedModule && (
        <EnvironmentalQuiz
          module={selectedModule}
          onComplete={(score: number, totalPoints: number) => handleQuizComplete(selectedModule.id, score)}
          onClose={handleQuizClose}
        />
      )}

      {showChallengeDetail && selectedChallenge && (
        <ChallengeDetailModal
          challenge={selectedChallenge}
          isOpen={showChallengeDetail}
          onStart={() => {}}
          onComplete={handleCompleteChallenge}
          onClose={handleChallengeDetailClose}
          userLevel={userProgress.level}
        />
      )}

      {showGameModal && selectedGame && (
        <GameModal
          game={selectedGame}
          isOpen={showGameModal}
          isCompleted={false}
          onComplete={handleCompleteGame}
          onClose={handleGameModalClose}
        />
      )}

      {showBossModal && selectedBoss && (
        <GameModal
          game={selectedBoss}
          isOpen={showBossModal}
          isCompleted={false}
          onComplete={handleCompleteBoss}
          onClose={handleBossModalClose}
        />
      )}

      {showQuestModal && selectedQuest && (
        <GameModal
          game={selectedQuest}
          isOpen={showQuestModal}
          isCompleted={false}
          onComplete={handleCompleteQuest}
          onClose={handleQuestModalClose}
        />
      )}

      {showLessonBossModal && selectedLessonBoss && (
        <GameModal
          game={selectedLessonBoss}
          isOpen={showLessonBossModal}
          isCompleted={false}
          onComplete={handleCompleteLessonBoss}
          onClose={handleLessonBossModalClose}
        />
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div key="profile-modal" className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-semibold">Profile</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProfile(false)}
                className="rounded-full"
              >
                ✕
              </Button>
            </div>
            <div className="p-0">
              <Profile />
            </div>
          </div>
        </div>
      )}

      {/* Welcome Quiz Modal */}
      {showWelcomeQuiz && (
        <WelcomeQuiz onComplete={handleWelcomeQuizComplete} />
      )}

      {/* Lesson Content Modal */}
      {showLessonContent && selectedLesson && (
        <LessonContent
          lesson={selectedLesson}
          onComplete={() => handleCompleteLesson(selectedLesson.id)}
          onClose={() => {
            setShowLessonContent(false);
            setSelectedLesson(null);
          }}
        />
      )}
      
        {/* Developer Mode Modal */}
        <DeveloperMode 
          isOpen={showDeveloperMode} 
          onClose={() => setShowDeveloperMode(false)} 
        />
        
        {/* Temporary Dev Mode Test - Remove this later */}
        <div className="fixed bottom-4 right-4 z-40 space-y-2 max-h-96 overflow-y-auto">
          <DevModeTest />
          <GameTest />
        </div>
      </div>
    );
  };

  export default Dashboard;