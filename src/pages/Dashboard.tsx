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
import NewsSection from '@/components/news/NewsSection';
import GameModal from '@/components/rpg/GameModal';
import Profile from '@/components/profile/Profile';
import { QuizModule } from '@/data/quizData';
import { Challenge, getUnlockedChallenges } from '@/data/challenges';
import { Lesson } from '@/data/lessons';
import { Game, Boss } from '@/data/rpgLessons';
import { LessonQuest, LessonBoss } from '@/data/lessonQuests';
import { useProgress } from '@/contexts/ProgressContext';

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

  const { profile } = useProfile();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { userProgress } = useProgress();

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
    setShowChallengeDetail(false);
    setSelectedChallenge(null);
  };

  const handleChallengeDetailClose = () => {
    setShowChallengeDetail(false);
    setSelectedChallenge(null);
  };

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowLessonDetail(true);
  };

  const handleCompleteLesson = (lessonId: string) => {
    console.log(`Lesson ${lessonId} completed`);
    setShowLessonDetail(false);
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

  return (
    <div className="min-h-screen bg-[#F6F7FB] parallax-container">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-
      xl sticky top-4 z-50 mx-4 rounded-2xl border border-white/20 navbar-3d navbar-shadow navbar-curved navbar-floating navbar-glass">
        <div className="w-full px-6 py-4">
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
                    value="profile" 
                    className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2 transition-all duration-300 ease-in-out hover:bg-gray-200"
                  >
                    Profile
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
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">K</span>
              </div>
              
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
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="dashboard" className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity */}
          <Card className="rounded-3xl border bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Activity</h3>
                <span className="text-xs text-muted-foreground">Last 7 days</span>
              </div>
              <div className="text-5xl font-semibold mb-2">24,9</div>
              <div className="text-sm text-muted-foreground mb-6">Hours spent</div>
              <ActivityBars />
            </CardContent>
          </Card>

          {/* Progress statistics */}
          <Card className="rounded-3xl border bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Progress statistics</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-2 rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-emerald-500" style={{ width: '64%' }} />
                </div>
                <div className="text-4xl font-semibold">64%</div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center rounded-2xl border p-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 mx-auto flex items-center justify-center mb-2">8</div>
                  <div className="text-xs text-muted-foreground">In progress</div>
                </div>
                <div className="text-center rounded-2xl border p-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center mb-2">12</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="text-center rounded-2xl border p-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-2">2</div>
                  <div className="text-xs text-muted-foreground">Late</div>
                </div>
                <div className="text-center rounded-2xl border p-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 mx-auto flex items-center justify-center mb-2">14</div>
                  <div className="text-xs text-muted-foreground">Upcoming</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Previous cards: Eco Tree, Daily Reward, Learning Streak */}
          <div className="space-y-6">
            <Card className="rounded-3xl border bg-white md:min-h-[360px]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">Your Eco Tree</h3>
                    <p className="text-sm text-muted-foreground">Grows with your environmental actions.</p>
                  </div>
                </div>
                <div className="mt-5">
                  <ErrorBoundary>
                    <CustomEcoTree />
                  </ErrorBoundary>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Gift className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">Daily Reward</h3>
                    <p className="text-sm text-muted-foreground mb-3">Claim your daily bonus.</p>
                    <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl">Claim 50 pts</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Flame className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">Learning Streak</h3>
                    <p className="text-sm text-muted-foreground">7 days in a row.</p>
                    <div className="text-2xl font-bold text-orange-600">7 days</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Community Coming Soon</h3>
              <p className="text-blue-600">Connect with other environmental learners and share your progress.</p>
            </div>
          </TabsContent>

          <TabsContent value="news" className="mt-6">
            <div className="max-w-6xl mx-auto">
              <NewsSection />
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Profile />
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
    </div>
  );
};

export default Dashboard;