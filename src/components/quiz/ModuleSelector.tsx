import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getAllQuizModules, QuizModule } from '@/data/quizData';
import { useProgress } from '@/contexts/ProgressContext';
import { Play, Lock, CheckCircle, Star, Clock } from 'lucide-react';

interface ModuleSelectorProps {
  onModuleSelect: (module: QuizModule) => void;
  isDarkMode?: boolean;
}

const ModuleSelector: React.FC<ModuleSelectorProps> = ({ onModuleSelect, isDarkMode = false }) => {
  const { userProgress } = useProgress();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  
  const modules = getAllQuizModules();
  const filteredModules = selectedDifficulty === 'all' 
    ? modules 
    : modules.filter(module => module.difficulty === selectedDifficulty);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '🟢';
      case 'intermediate': return '🟡';
      case 'advanced': return '🔴';
      default: return '⚪';
    }
  };

  const isModuleUnlocked = (module: QuizModule) => {
    // Unlock modules based on user level and completed quizzes
    const level = userProgress.level;
    const completedQuizzes = userProgress.completedQuizzes;
    
    switch (module.difficulty) {
      case 'beginner':
        return true; // Always unlocked
      case 'intermediate':
        return completedQuizzes >= 2 || level >= 2;
      case 'advanced':
        return completedQuizzes >= 5 || level >= 3;
      default:
        return true;
    }
  };

  const getModuleProgress = (moduleId: string) => {
    // This would be stored in user progress for each module
    // For now, return 0 as placeholder
    return 0;
  };

  const getEstimatedTime = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '5-10 min';
      case 'intermediate': return '10-15 min';
      case 'advanced': return '15-20 min';
      default: return '10 min';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-2">Environmental Learning Modules</h2>
        <p className="text-blue-600">Choose a topic to start your environmental education journey</p>
      </div>

      {/* Difficulty Filter */}
      <div className="flex justify-center space-x-2">
        {['all', 'beginner', 'intermediate', 'advanced'].map((difficulty) => (
          <Button
            key={difficulty}
            variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDifficulty(difficulty as any)}
            className="capitalize"
          >
            {difficulty === 'all' ? 'All Levels' : difficulty}
          </Button>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          const isUnlocked = isModuleUnlocked(module);
          const progress = getModuleProgress(module.id);
          const isCompleted = progress === 100;

          return (
            <Card 
              key={module.id} 
              className={`relative transition-all duration-200 hover:shadow-lg ${
                isUnlocked 
                  ? 'hover:scale-105 cursor-pointer' 
                  : 'opacity-60 cursor-not-allowed'
              } ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-200'}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{module.icon}</span>
                    <div>
                      <CardTitle className="text-lg text-blue-900">{module.title}</CardTitle>
                      <p className="text-sm text-blue-600">{module.description}</p>
                    </div>
                  </div>
                  <Badge className={getDifficultyColor(module.difficulty)}>
                    {getDifficultyIcon(module.difficulty)} {module.difficulty}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress */}
                {isUnlocked && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {/* Module Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{getEstimatedTime(module.difficulty)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>{module.questions.length} questions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{module.totalPoints} points</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  {isUnlocked ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full"
                          variant={isCompleted ? "outline" : "default"}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Retake Quiz
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Start Quiz
                            </>
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-3">
                            <span className="text-2xl">{module.icon}</span>
                            <div>
                              <div className="text-xl">{module.title}</div>
                              <div className="text-sm text-gray-600 font-normal">{module.description}</div>
                            </div>
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Badge className={getDifficultyColor(module.difficulty)}>
                                {module.difficulty}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>{getEstimatedTime(module.difficulty)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4" />
                              <span>{module.questions.length} questions</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>{module.totalPoints} points</span>
                            </div>
                          </div>

                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">What you'll learn:</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                              {module.questions.slice(0, 3).map((question, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="text-blue-600 mt-1">•</span>
                                  <span>{question.question}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex space-x-3">
                            <Button 
                              onClick={() => onModuleSelect(module)}
                              className="flex-1"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Start Quiz
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button disabled className="w-full">
                      <Lock className="w-4 h-4 mr-2" />
                      Locked
                    </Button>
                  )}
                </div>

                {/* Locked Overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-gray-100 bg-opacity-80 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        Complete {module.difficulty === 'intermediate' ? '2' : '5'} quizzes to unlock
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ModuleSelector;
