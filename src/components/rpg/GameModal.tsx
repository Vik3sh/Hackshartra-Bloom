import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Star, 
  Target,
  Brain,
  Zap,
  Puzzle,
  Gamepad2
} from 'lucide-react';
import { Game, Boss } from '@/data/rpgLessons';
import WasteSortingGame from '@/components/games/WasteSortingGame';
import TemperatureRisingGame from '@/components/games/TemperatureRisingGame';
import GreenhouseGasPuzzle from '@/components/games/GreenhouseGasPuzzle';
import HtmlGameWrapper from '@/components/games/HtmlGameWrapper';
import { loadHtmlGame, getHtmlGameById } from '@/utils/gameLoader';

interface GameModalProps {
  game: Game | Boss | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (gameId: string) => void;
  isCompleted: boolean;
}

export default function GameModal({ 
  game, 
  isOpen, 
  onClose, 
  onComplete, 
  isCompleted 
}: GameModalProps) {
  const [showGame, setShowGame] = useState(false);
  const [htmlGameContent, setHtmlGameContent] = useState<string>('');
  const [isLoadingHtmlGame, setIsLoadingHtmlGame] = useState(false);
  
  if (!game) return null;

  const isBoss = 'bossType' in game;
  const gameType = isBoss ? game.bossType : game.type;

  const getGameTypeIcon = (type: string) => {
    switch (type) {
      case 'simulation': return <Brain className="w-5 h-5" />;
      case 'puzzle': return <Puzzle className="w-5 h-5" />;
      case 'action': return <Zap className="w-5 h-5" />;
      case 'strategy': return <Target className="w-5 h-5" />;
      case 'quiz': return <Brain className="w-5 h-5" />;
      default: return <Gamepad2 className="w-5 h-5" />;
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

  const handleComplete = () => {
    onComplete(game.id);
  };

  const handleStartGame = () => {
    setShowGame(true);
  };

  const handleGameComplete = (score: number, bonus: number) => {
    setShowGame(false);
    onComplete(game.id);
  };

  const handleGameClose = () => {
    setShowGame(false);
  };

  const handleLoadHtmlGame = async () => {
    if (!game) return;
    
    console.log('Loading HTML game:', game.id);
    setIsLoadingHtmlGame(true);
    try {
      const content = await loadHtmlGame(game.id);
      console.log('HTML content loaded, length:', content.length);
      setHtmlGameContent(content);
      setShowGame(true);
      console.log('Game should now be visible');
    } catch (error) {
      console.error('Failed to load HTML game:', error);
    } finally {
      setIsLoadingHtmlGame(false);
    }
  };

  const isHtmlGame = (gameId: string) => {
    return ['fire-escape', 'cyclone-survival', 'earthquake-survival', 'fire-escape-game', 'flood-escape'].includes(gameId);
  };

  // Render specific interactive game
  const renderInteractiveGame = () => {
    if (!showGame) return null;

    // Check if it's an HTML game
    if (isHtmlGame(game.id)) {
      return (
        <HtmlGameWrapper
          gameId={game.id}
          title={game.title}
          description={game.description}
          htmlContent={htmlGameContent}
          onComplete={handleGameComplete}
          onClose={handleGameClose}
          isCompleted={isCompleted}
        />
      );
    }

    // Render React games
    switch (game.id) {
      case 'waste-sorting-game':
        return <WasteSortingGame onComplete={handleGameComplete} onClose={handleGameClose} />;
      case 'warming-forest-game':
        return <TemperatureRisingGame onComplete={handleGameComplete} onClose={handleGameClose} />;
      case 'greenhouse-puzzle':
        return <GreenhouseGasPuzzle onComplete={handleGameComplete} onClose={handleGameClose} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {getGameTypeIcon(gameType)}
              <div>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  {game.title}
                  {isBoss && <span className="text-purple-600">👑</span>}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {game.description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

        <div className="space-y-6">
          {/* Game Info */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getDifficultyColor(game.difficulty)}>
              {game.difficulty}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {game.duration} minutes
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {game.points} points
            </Badge>
            <Badge variant="outline">
              {gameType}
            </Badge>
            {isBoss && (
              <Badge className="bg-purple-100 text-purple-800">
                Boss Battle
              </Badge>
            )}
          </div>

          {/* Instructions */}
          <Card>
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Play className="w-4 h-4" />
                How to Play
              </h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700">{game.instructions}</p>
              </div>
            </CardContent>
          </Card>

          {/* Objectives */}
          <Card>
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Objectives
              </h3>
              <ul className="space-y-2">
                {game.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Rewards */}
          <Card>
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Rewards
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">{game.points} Points</span>
                </div>
                {Object.entries(game.rewards).map(([itemId, quantity]) => (
                  <div key={itemId} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                    <span className="text-lg">
                      {itemId === 'seed' ? '🌱' :
                       itemId === 'water' ? '💧' :
                       itemId === 'sunlight' ? '☀️' :
                       itemId === 'nutrients' ? '🌿' :
                       itemId === 'fertilizer' ? '🌾' :
                       itemId === 'love' ? '❤️' : '🎁'}
                    </span>
                    <span className="text-sm font-medium">{quantity} {itemId}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Game Area */}
          <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-300">
            <CardContent className="pt-6 pb-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Gamepad2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  {isBoss ? 'Boss Battle Arena' : 'Game Arena'}
                </h3>
                <p className="text-blue-600 mb-4">
                  {isBoss 
                    ? 'Face the ultimate challenge in this epic boss battle!'
                    : 'Get ready to play this exciting environmental game!'
                  }
                </p>
                
                {/* Check if we have an interactive game */}
                {['waste-sorting-game', 'warming-forest-game', 'greenhouse-puzzle'].includes(game.id) ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-800 mb-3">
                        <strong>Interactive Game Available!</strong> This game has been fully implemented with engaging gameplay.
                      </p>
                      <Button onClick={handleStartGame} className="bg-green-600 hover:bg-green-700">
                        <Play className="w-4 h-4 mr-2" />
                        Play Interactive Game
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600">
                      Or complete without playing to earn basic rewards
                    </div>
                  </div>
                ) : isHtmlGame(game.id) ? (
                  <div className="space-y-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-sm text-orange-800 mb-3">
                        <strong>HTML Game Available!</strong> This is a full-featured survival game with immersive gameplay.
                      </p>
                      <Button 
                        onClick={handleLoadHtmlGame} 
                        disabled={isLoadingHtmlGame}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {isLoadingHtmlGame ? 'Loading...' : 'Play HTML Game'}
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600">
                      Or complete without playing to earn basic rewards
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Coming Soon!</strong> The interactive version of this game will be added soon. 
                      For now, you can complete the game to earn rewards and progress.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {isCompleted ? (
              <Button disabled className="flex-1 bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Close
                </Button>
                <Button 
                  onClick={handleComplete}
                  className={`flex-1 ${
                    isBoss 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isBoss ? 'Defeat Boss' : 'Complete Game'}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
      </Dialog>
      
      {/* Render Interactive Game outside Dialog */}
      {renderInteractiveGame()}
    </>
  );
}
