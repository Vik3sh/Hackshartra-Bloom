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
  Brain
} from 'lucide-react';
import { MajorLevel, SubLevel, Game, Boss, canAccessMajorLevel, canAccessSubLevel, canAccessGame, canAccessBoss, updateLevelProgress, RPG_MAJOR_LEVELS } from '@/data/rpgLessons';
import { useProgress } from '@/contexts/ProgressContext';

interface RPGLevelSelectorProps {
  onStartGame: (game: Game) => void;
  onStartBoss: (boss: Boss) => void;
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

export default function RPGLevelSelector({ onStartGame, onStartBoss }: RPGLevelSelectorProps) {
  const { userProgress } = useProgress();
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);
  const [expandedSubLevel, setExpandedSubLevel] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-900 mb-2">🌍 Environmental Quest</h2>
        <p className="text-blue-600 text-lg">Embark on an epic journey through environmental challenges!</p>
      </div>

      {RPG_MAJOR_LEVELS.map((level) => {
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
                                const canAccessGame = canAccessGame(game.id, userProgress.completedGames || []);

                                return (
                                  <div
                                    key={game.id}
                                    className={`p-3 rounded-lg border transition-all ${
                                      isGameCompleted 
                                        ? 'bg-green-100 border-green-300' 
                                        : canAccessGame 
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
                                      disabled={!canAccessGame || isGameCompleted}
                                      className={`w-full ${
                                        isGameCompleted 
                                          ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                                          : canAccessGame 
                                            ? 'bg-blue-600 hover:bg-blue-700' 
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      }`}
                                    >
                                      {isGameCompleted ? (
                                        <>
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                          Completed
                                        </>
                                      ) : canAccessGame ? (
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
  );
}
