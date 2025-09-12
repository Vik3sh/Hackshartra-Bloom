import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import WasteSortingGame from '@/components/games/WasteSortingGame';
import TemperatureRisingGame from '@/components/games/TemperatureRisingGame';
import GreenhouseGasPuzzle from '@/components/games/GreenhouseGasPuzzle';

const GameTest: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  const handleGameComplete = (score: number, bonus: number) => {
    console.log('Game completed!', { score, bonus });
    setActiveGame(null);
  };

  const handleGameClose = () => {
    setActiveGame(null);
  };

  const games = [
    { id: 'waste-sorting', name: 'Waste Sorting Master', component: WasteSortingGame },
    { id: 'temperature-rising', name: 'Temperature Rising', component: TemperatureRisingGame },
    { id: 'greenhouse-puzzle', name: 'Greenhouse Gas Puzzle', component: GreenhouseGasPuzzle },
  ];

  if (!isVisible) return null;

  return (
    <>
      <Card className="w-80 bg-white shadow-lg border-2 border-blue-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-blue-700">Games Test</CardTitle>
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-6 w-6 p-0"
              >
                {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        {!isCollapsed && (
          <CardContent className="space-y-3 pt-0">
            <div className="space-y-2">
              {games.map((game) => (
                <div key={game.id} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-xs">{game.name}</span>
                  <Button 
                    size="sm" 
                    onClick={() => setActiveGame(game.id)}
                    disabled={activeGame !== null}
                    className="text-xs h-6 px-2"
                  >
                    Test
                  </Button>
                </div>
              ))}
            </div>
            
            {activeGame && (
              <div className="mt-2 p-2 bg-blue-50 rounded">
                <p className="text-xs text-blue-800">
                  Testing: {games.find(g => g.id === activeGame)?.name}
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
      
      {/* Render the active game */}
      {activeGame === 'waste-sorting' && (
        <WasteSortingGame onComplete={handleGameComplete} onClose={handleGameClose} />
      )}
      {activeGame === 'temperature-rising' && (
        <TemperatureRisingGame onComplete={handleGameComplete} onClose={handleGameClose} />
      )}
      {activeGame === 'greenhouse-puzzle' && (
        <GreenhouseGasPuzzle onComplete={handleGameComplete} onClose={handleGameClose} />
      )}
    </>
  );
};

export default GameTest;