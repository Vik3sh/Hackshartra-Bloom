import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lock, 
  CheckCircle, 
  Play, 
  Crown,
  Sword,
  Shield,
  Star,
  Zap,
  Leaf,
  Trash2,
  Gamepad2,
  Puzzle,
  Target,
  Brain,
  BookOpen,
  Clock,
  GraduationCap
} from 'lucide-react';
import { LessonModule as LessonModuleType, Lesson, canAccessLesson, updateModuleProgress, LESSON_MODULES } from '@/data/lessons';
import { MajorLevel, SubLevel, Game, Boss, canAccessMajorLevel, canAccessSubLevel, canAccessGame, canAccessBoss, updateLevelProgress, RPG_MAJOR_LEVELS } from '@/data/rpgLessons';
import { LessonQuestModule, LessonQuest, LessonBoss, canAccessQuest, canAccessBoss as canAccessLessonBoss, updateQuestModuleProgress, LESSON_QUEST_MODULES, getQuestModuleByLessonId } from '@/data/lessonQuests';
import { useProgress } from '@/contexts/ProgressContext';
import { useLessonProgression } from '@/contexts/LessonProgressionContext';
import { StoryModal } from '@/components/story/StoryModal';

interface UnifiedLessonSystemProps {
  onStartLesson: (lesson: Lesson) => void;
  onStartGame: (game: Game) => void;
  onStartBoss: (boss: Boss) => void;
  onStartQuest: (quest: LessonQuest) => void;
  onStartLessonBoss: (boss: LessonBoss) => void;
}

const getGameTypeIcon = (type: string) => {
  switch (type) {
    case 'simulation': return <Brain className="w-4 h-4" />;
    case 'puzzle': return <Puzzle className="w-4 h-4" />;
    case 'action': return <Zap className="w-4 h-4" />;
    case 'strategy': return <Target className="w-4 h-4" />;
    case 'quiz': return <Brain className="w-4 h-4" />;
    default: return <Gamepad2 className="w-4 h-4" />;
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'hard': return 'bg-red-100 text-red-800';
    case 'extreme': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getBossTypeIcon = (type: string) => {
  switch (type) {
    case 'quiz': return <Brain className="w-5 h-5" />;
    case 'simulation': return <Brain className="w-5 h-5" />;
    case 'puzzle': return <Puzzle className="w-5 h-5" />;
    case 'action': return <Sword className="w-5 h-5" />;
    default: return <Crown className="w-5 h-5" />;
  }
};

export default function UnifiedLessonSystem({ onStartLesson, onStartGame, onStartBoss, onStartQuest, onStartLessonBoss }: UnifiedLessonSystemProps) {
  const { userProgress, addItems } = useProgress();
  const { lessonProgress, completeLesson: completeLessonProgression, canAccessLesson: canAccessLessonProgression, getModuleProgress } = useLessonProgression();
  const [activeView, setActiveView] = useState<'traditional' | 'rpg'>('traditional');
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);
  const [expandedSubLevel, setExpandedSubLevel] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showNextLevel, setShowNextLevel] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);


  // Level switching functions
  const nextLevel = () => {
    setShowNextLevel(true);
  };

  const previousLevel = () => {
    setShowNextLevel(false);
  };

  // Use all modules and RPG levels (keep everything as is)
  const filteredModules = LESSON_MODULES;
  const filteredRPGLevels = RPG_MAJOR_LEVELS;

  // Debug logging
  console.log('UnifiedLessonSystem - userProgress:', userProgress);
  console.log('UnifiedLessonSystem - LESSON_MODULES:', LESSON_MODULES);

  const handleStartLesson = (lesson: Lesson) => {
    // Check if lesson is accessible using the new progression system
    const moduleId = getModuleIdFromLesson(lesson.id);
    if (canAccessLessonProgression(lesson.id, moduleId)) {
      onStartLesson(lesson);
    }
  };

  const handleCompleteLesson = (lesson: Lesson) => {
    const moduleId = getModuleIdFromLesson(lesson.id);
    
    // Complete lesson in progression system
    completeLessonProgression(lesson.id, moduleId);
    
    // Give rewards based on lesson type
    const rewards = getLessonRewards(lesson.id, moduleId);
    addItems(rewards);
    
    // Update progress context
    completeLesson(lesson.id, 500, rewards);
  };

  const getModuleIdFromLesson = (lessonId: string): string => {
    // Map lesson IDs to module IDs based on actual lesson data
    if (lessonId.startsWith('climate-')) return 'climate-change';
    if (lessonId.startsWith('waste-')) return 'waste-management';
    if (lessonId.startsWith('energy-')) return 'renewable-energy';
    if (lessonId.startsWith('conservation-')) return 'conservation';
    return 'climate-change'; // default
  };

  const getLessonRewards = (lessonId: string, moduleId: string): { [itemId: string]: number } => {
    // Different rewards based on lesson type and module
    const baseRewards = {
      water: 2,
      sunlight: 2,
      nutrients: 1,
      fertilizer: 1
    };

    // Bonus rewards for advanced lessons
    if (lessonId.includes('advanced')) {
      return {
        ...baseRewards,
        water: 3,
        sunlight: 3,
        nutrients: 2,
        fertilizer: 2,
        love: 1
      };
    }

    // Module-specific rewards
    if (moduleId === 'climate-change') {
      return { ...baseRewards, water: 3 };
    } else if (moduleId === 'waste-management') {
      return { ...baseRewards, nutrients: 2 };
    } else if (moduleId === 'renewable-energy') {
      return { ...baseRewards, sunlight: 3 };
    } else if (moduleId === 'conservation') {
      return { ...baseRewards, fertilizer: 2, love: 1 };
    }

    return baseRewards;
  };

  const handleStartGame = (game: Game) => {
    if (canAccessGame(game.id, userProgress.completedGames || [])) {
      onStartGame(game);
    }
  };

  const handleStartBoss = (boss: Boss) => {
    if (canAccessBoss(boss.id, userProgress.completedGames || [])) {
      onStartBoss(boss);
    }
  };

  const handleStartQuest = (quest: LessonQuest) => {
    if (canAccessQuest(quest.id, userProgress.completedLessons || [], userProgress.completedGames || [])) {
      onStartQuest(quest);
    }
  };

  const handleStartLessonBoss = (boss: LessonBoss) => {
    if (canAccessLessonBoss(boss.id, userProgress.completedLessons || [], userProgress.completedGames || [])) {
      onStartLessonBoss(boss);
    }
  };

  try {
    return (
      <div className="space-y-6">
      {/* Level Navigation */}
      <div className={`bg-gradient-to-r ${
        showNextLevel ? 'from-green-600 to-teal-600' : 'from-blue-600 to-green-600'
      } text-white p-4 rounded-lg mb-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{showNextLevel ? '♻️' : '🌍'}</div>
            <div>
              <h2 className="text-2xl font-bold">
                {showNextLevel ? 'Waste Management Revolution' : 'Climate Change Crisis'}
              </h2>
              <p className="text-white/90">
                {showNextLevel 
                  ? 'Learn sustainable waste practices and circular economy principles' 
                  : 'Master the fundamentals of climate science and understand global warming'
                }
              </p>
              <div className="text-sm text-white/80 mt-1">
                {showNextLevel ? 'Level 2 of 5' : 'Level 1 of 5'}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={previousLevel}
              disabled={!showNextLevel}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 disabled:opacity-50"
            >
              ← Previous
            </Button>
            <Button
              variant="outline"
              onClick={nextLevel}
              disabled={showNextLevel}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 disabled:opacity-50"
            >
              Next Level →
            </Button>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-blue-50 rounded-lg p-1 border border-blue-200">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveView('traditional')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeView === 'traditional'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-blue-600 hover:bg-blue-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Traditional Lessons
            </button>
            <button
              onClick={() => setActiveView('rpg')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeView === 'rpg'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-blue-600 hover:bg-blue-100'
              }`}
            >
              <Crown className="w-4 h-4" />
              RPG Quests
            </button>
          </div>
        </div>
      </div>

      {/* Traditional Lessons View */}
      {activeView === 'traditional' && (
        <div className="space-y-6">
          {/* Level Information */}
          <Card className={`bg-gradient-to-r ${
            showNextLevel ? 'from-green-50 to-teal-50 border-green-200' : 'from-blue-50 to-green-50 border-blue-200'
          }`}>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className={`text-xl font-bold mb-3 ${
                  showNextLevel ? 'text-green-800' : 'text-blue-800'
                }`}>
                  🎯 {showNextLevel ? 'Level 2: Waste Management Revolution' : 'Level 1: Climate Change Crisis'}
                </h3>
                <p className={`mb-4 ${
                  showNextLevel ? 'text-green-700' : 'text-blue-700'
                }`}>
                  {showNextLevel 
                    ? "Punjab generates massive amounts of waste daily. It's time to revolutionize how we handle our resources! From plastic pollution in our rivers to organic waste in our fields, Punjab needs innovative waste management solutions."
                    : "Master the essential concepts of climate science, greenhouse gases, and their impact on Punjab's environment. Complete all lessons to unlock the next level!"
                  }
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className={`text-2xl font-bold ${
                      showNextLevel ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {filteredModules.reduce((total, module) => total + module.lessons.length, 0)}
                    </div>
                    <div className={`text-sm ${
                      showNextLevel ? 'text-green-700' : 'text-blue-700'
                    }`}>
                      Lessons
                    </div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className={`text-2xl font-bold ${
                      showNextLevel ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {filteredModules.reduce((total, module) => total + module.lessons.reduce((sum, lesson) => sum + lesson.points, 0), 0)}
                    </div>
                    <div className={`text-sm ${
                      showNextLevel ? 'text-green-700' : 'text-blue-700'
                    }`}>
                      Total Points
                    </div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className={`text-2xl font-bold ${
                      showNextLevel ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {Math.ceil(filteredModules.reduce((total, module) => total + module.lessons.reduce((sum, lesson) => sum + lesson.duration, 0), 0) / 60)}
                    </div>
                    <div className={`text-sm ${
                      showNextLevel ? 'text-green-700' : 'text-blue-700'
                    }`}>
                      Hours
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
            {filteredModules.map((module) => {
              const updatedModule = updateModuleProgress(module.id, userProgress.completedLessons || []);
              const isExpanded = expandedModule === module.id;

              return (
                <Card key={module.id} className="bg-white border-blue-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                          module.color === 'red' ? 'bg-red-100' :
                          module.color === 'green' ? 'bg-green-100' :
                          module.color === 'yellow' ? 'bg-yellow-100' :
                          'bg-gray-100'
                        }`}>
                          {module.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl text-blue-900">{module.title}</CardTitle>
                          <p className="text-blue-600 text-sm">{module.description}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                      >
                        {isExpanded ? 'Hide Lessons' : 'Show Lessons'}
                      </Button>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-blue-700">Progress</span>
                        <span className="text-sm text-blue-600">
                          {updatedModule?.completedLessons || 0}/{updatedModule?.totalLessons || 0} lessons
                        </span>
                      </div>
                      <Progress 
                        value={updatedModule?.progress || 0} 
                        className="h-3"
                      />
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {module.lessons.map((lesson, index) => {
                          const moduleId = getModuleIdFromLesson(lesson.id);
                          const isCompleted = lessonProgress.completedLessons?.includes(lesson.id) || false;
                          const canAccess = canAccessLessonProgression(lesson.id, moduleId);
                          const isLocked = !canAccess && !isCompleted;
                          
                          // Get connected quest module for this lesson
                          const questModule = getQuestModuleByLessonId(lesson.id);
                          const hasQuests = questModule && questModule.quests && questModule.quests.length > 0;

                          return (
                            <div key={lesson.id} className="space-y-3">
                              {/* Lesson Card */}
                              <div
                                className={`p-4 rounded-lg border transition-all ${
                                  isCompleted 
                                    ? 'bg-green-50 border-green-200' 
                                    : isLocked 
                                      ? 'bg-gray-50 border-gray-200 opacity-60' 
                                      : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                      isCompleted 
                                        ? 'bg-green-500 text-white' 
                                        : isLocked 
                                          ? 'bg-gray-300 text-gray-500' 
                                          : 'bg-blue-500 text-white'
                                    }`}>
                                      {isCompleted ? (
                                        <CheckCircle className="w-4 h-4" />
                                      ) : isLocked ? (
                                        <Lock className="w-4 h-4" />
                                      ) : (
                                        <span className="text-sm font-bold">{index + 1}</span>
                                      )}
                                    </div>
                                    
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <h4 className={`font-semibold ${
                                          isCompleted ? 'text-green-800' : 
                                          isLocked ? 'text-gray-500' : 'text-blue-900'
                                        }`}>
                                          {lesson.title}
                                        </h4>
                                        <Badge className={getDifficultyColor(lesson.difficulty)}>
                                          {lesson.difficulty}
                                        </Badge>
                                        {hasQuests && (
                                          <Badge className="bg-purple-100 text-purple-800">
                                            <Gamepad2 className="w-3 h-3 mr-1" />
                                            Has Quests
                                          </Badge>
                                        )}
                                      </div>
                                      <p className={`text-sm ${
                                        isCompleted ? 'text-green-600' : 
                                        isLocked ? 'text-gray-400' : 'text-blue-600'
                                      }`}>
                                        {lesson.description}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <div className="text-right">
                                      <div className="flex items-center text-xs text-blue-600 mb-1">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {lesson.duration}min
                                      </div>
                                      <div className="flex items-center text-xs text-blue-600">
                                        <Star className="w-3 h-3 mr-1" />
                                        {lesson.points} pts
                                      </div>
                                    </div>

                                    <div className="flex space-x-2">
                                      <Button
                                        size="sm"
                                        onClick={() => handleStartLesson(lesson)}
                                        disabled={isLocked || isCompleted}
                                        className={
                                          isCompleted 
                                            ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                                            : isLocked 
                                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                              : 'bg-blue-600 hover:bg-blue-700'
                                        }
                                      >
                                        {isCompleted ? (
                                          <>
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Completed
                                          </>
                                        ) : isLocked ? (
                                          <>
                                            <Lock className="w-4 h-4 mr-1" />
                                            Locked
                                          </>
                                        ) : (
                                          <>
                                            <Play className="w-4 h-4 mr-1" />
                                            Start
                                          </>
                                        )}
                                      </Button>
                                      
                                      {!isLocked && !isCompleted && (
                                        <Button
                                          size="sm"
                                          onClick={() => handleCompleteLesson(lesson)}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          <CheckCircle className="w-4 h-4 mr-1" />
                                          Complete
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
                    </CardContent>
                  )}
                </Card>
              );
            })}
        </div>
      )}

      {/* RPG Quests View */}
      {activeView === 'rpg' && (
        <div className="space-y-6">
          {/* Story Section */}
          <Card className={`bg-gradient-to-r ${
            showNextLevel ? 'from-green-50 to-teal-50 border-green-200' : 'from-blue-50 to-green-50 border-blue-200'
          }`}>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className={`text-xl font-bold mb-3 ${
                  showNextLevel ? 'text-green-800' : 'text-blue-800'
                }`}>
                  📖 Quest Story
                </h3>
                <p className={`mb-4 ${
                  showNextLevel ? 'text-green-700' : 'text-blue-700'
                }`}>
                  {showNextLevel 
                    ? "Punjab generates massive amounts of waste daily. It's time to revolutionize how we handle our resources! From plastic pollution in our rivers to organic waste in our fields, Punjab needs innovative waste management solutions."
                    : "Welcome to the Climate Change realm! Punjab's environment is under threat from rising temperatures, changing weather patterns, and extreme events. As an environmental hero, you must master the fundamentals of climate science to protect our beautiful state."
                  }
                </p>
                <div className="bg-white/50 rounded-lg p-4 mb-4">
                  <p className={`text-sm italic ${
                    showNextLevel ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {showNextLevel 
                      ? "Master waste sorting, composting techniques, and circular economy principles. Help Punjab become a zero-waste state through your heroic actions!"
                      : "In this realm, you'll face climate challenges that test your knowledge and skills. Each quest brings you closer to becoming a true environmental champion for Punjab!"
                    }
                  </p>
                </div>
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={() => setShowStoryModal(true)}
                    className={`${
                      showNextLevel ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Begin Adventure
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowStoryModal(true)}
                    className={`${
                      showNextLevel ? 'border-green-300 text-green-700' : 'border-blue-300 text-blue-700'
                    }`}
                  >
                    View Story Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
            {filteredRPGLevels.map((level) => {
              const updatedLevel = updateLevelProgress(level.id, userProgress.completedGames || []);
              const canAccess = canAccessMajorLevel(level.id, userProgress.completedMajorLevels || []);
              const isExpanded = expandedLevel === level.id;

              return (
                <Card key={level.id} className={`bg-white border-2 transition-all ${
                  canAccess 
                    ? 'border-blue-200 hover:shadow-lg' 
                    : 'border-gray-200 opacity-60'
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${
                          level.color === 'red' ? 'bg-red-100' :
                          level.color === 'green' ? 'bg-green-100' :
                          level.color === 'yellow' ? 'bg-yellow-100' :
                          'bg-gray-100'
                        }`}>
                          {level.icon}
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-blue-900 flex items-center gap-2">
                            {level.title}
                            {!canAccess && <Lock className="w-5 h-5 text-gray-400" />}
                          </CardTitle>
                          <p className="text-blue-600">{level.description}</p>
                          <p className="text-sm text-gray-500 italic">{level.theme}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-blue-100 text-blue-800">
                            Level {level.order}
                          </Badge>
                          {level.isCompleted && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {updatedLevel?.completedGames || 0}/{updatedLevel?.totalGames || 0} games
                        </div>
                        <Progress 
                          value={updatedLevel?.progress || 0} 
                          className="w-32 h-2 mt-1"
                        />
                      </div>
                    </div>

                    {canAccess && (
                      <Button
                        variant="outline"
                        onClick={() => setExpandedLevel(isExpanded ? null : level.id)}
                        className="w-full mt-4"
                      >
                        {isExpanded ? 'Hide Sub-Levels' : 'Show Sub-Levels'}
                      </Button>
                    )}
                  </CardHeader>

                  {isExpanded && canAccess && (
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {level.subLevels.map((subLevel) => {
                          const canAccessSub = canAccessSubLevel(subLevel.id, userProgress.completedSubLevels || []);
                          const isSubExpanded = expandedSubLevel === subLevel.id;

                          return (
                            <Card key={subLevel.id} className={`border ${
                              canAccessSub 
                                ? 'border-green-200 bg-green-50' 
                                : 'border-gray-200 bg-gray-50'
                            }`}>
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                      canAccessSub ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
                                    }`}>
                                      {subLevel.order}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-green-900">{subLevel.title}</h4>
                                      <p className="text-sm text-green-600">{subLevel.description}</p>
                                    </div>
                                  </div>
                                  
                                  {canAccessSub && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setExpandedSubLevel(isSubExpanded ? null : subLevel.id)}
                                    >
                                      {isSubExpanded ? 'Hide Games' : 'Show Games'}
                                    </Button>
                                  )}
                                </div>
                              </CardHeader>

                              {isSubExpanded && canAccessSub && (
                                <CardContent className="pt-0">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {subLevel.games.map((game) => {
                                      const isGameCompleted = userProgress.completedGames?.includes(game.id) || false;
                                      const canAccessThisGame = canAccessGame(game.id, userProgress.completedGames || []);

                                      return (
                                        <div
                                          key={game.id}
                                          className={`p-3 rounded-lg border transition-all ${
                                            isGameCompleted 
                                              ? 'bg-green-100 border-green-300' 
                                              : canAccessThisGame 
                                                ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                                                : 'bg-gray-50 border-gray-200 opacity-60'
                                          }`}
                                        >
                                          <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                              {getGameTypeIcon(game.type)}
                                              <h5 className="font-medium text-sm">{game.title}</h5>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                              <Badge className={getDifficultyColor(game.difficulty)}>
                                                {game.difficulty}
                                              </Badge>
                                              {isGameCompleted && (
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                              )}
                                            </div>
                                          </div>
                                          
                                          <p className="text-xs text-gray-600 mb-2">{game.description}</p>
                                          
                                          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                            <span>{game.duration}min</span>
                                            <span>{game.points} pts</span>
                                          </div>

                                          <Button
                                            size="sm"
                                            onClick={() => handleStartGame(game)}
                                            disabled={!canAccessThisGame || isGameCompleted}
                                            className={`w-full ${
                                              isGameCompleted 
                                                ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                                                : canAccessThisGame 
                                                  ? 'bg-blue-600 hover:bg-blue-700' 
                                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                          >
                                            {isGameCompleted ? (
                                              <>
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Completed
                                              </>
                                            ) : canAccessThisGame ? (
                                              <>
                                                <Play className="w-3 h-3 mr-1" />
                                                Play
                                              </>
                                            ) : (
                                              <>
                                                <Lock className="w-3 h-3 mr-1" />
                                                Locked
                                              </>
                                            )}
                                          </Button>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Boss Battle */}
                                  <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className={`p-4 rounded-lg border-2 ${
                                      canAccessBoss(level.boss.id, userProgress.completedGames || [])
                                        ? 'border-purple-300 bg-purple-50' 
                                        : 'border-gray-200 bg-gray-50'
                                    }`}>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                            canAccessBoss(level.boss.id, userProgress.completedGames || [])
                                              ? 'bg-purple-500 text-white' 
                                              : 'bg-gray-300 text-gray-500'
                                          }`}>
                                            <Crown className="w-6 h-6" />
                                          </div>
                                          <div>
                                            <h4 className="font-bold text-purple-900 flex items-center gap-2">
                                              {level.boss.title}
                                              {getBossTypeIcon(level.boss.bossType)}
                                            </h4>
                                            <p className="text-sm text-purple-600">{level.boss.description}</p>
                                            <p className="text-xs text-gray-500 italic">{level.boss.bossTheme}</p>
                                          </div>
                                        </div>
                                        
                                        <div className="text-right">
                                          <Badge className={getDifficultyColor(level.boss.difficulty)}>
                                            {level.boss.difficulty}
                                          </Badge>
                                          <div className="text-xs text-gray-500 mt-1">
                                            {level.boss.duration}min • {level.boss.points} pts
                                          </div>
                                        </div>
                                      </div>

                                      <Button
                                        size="sm"
                                        onClick={() => handleStartBoss(level.boss)}
                                        disabled={!canAccessBoss(level.boss.id, userProgress.completedGames || [])}
                                        className={`w-full mt-3 ${
                                          canAccessBoss(level.boss.id, userProgress.completedGames || [])
                                            ? 'bg-purple-600 hover:bg-purple-700' 
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                      >
                                        {canAccessBoss(level.boss.id, userProgress.completedGames || []) ? (
                                          <>
                                            <Sword className="w-4 h-4 mr-2" />
                                            Challenge Boss
                                          </>
                                        ) : (
                                          <>
                                            <Lock className="w-4 h-4 mr-2" />
                                            Complete All Games First
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              )}
                            </Card>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
        </div>
      )}

      {/* Story Modal */}
      <StoryModal
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
        level={showNextLevel ? 2 : 1}
      />
    </div>
  );
} catch (error) {
  console.error('Error in UnifiedLessonSystem:', error);
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold text-red-900 mb-2">Error Loading Lessons</h3>
      <p className="text-red-600">There was an error loading the lesson system. Please try refreshing the page.</p>
      <p className="text-sm text-gray-500 mt-2">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
    </div>
  );
}
}
