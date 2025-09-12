import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Settings, 
  Zap, 
  Unlock, 
  Gift, 
  TreePine, 
  Star,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

interface DeveloperModeProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeveloperMode: React.FC<DeveloperModeProps> = ({ isOpen, onClose }) => {
  const { userProgress, addItems, upgradeStage, completeQuiz, completeLesson, completeGame, completeChallenge } = useProgress();
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [customItems, setCustomItems] = useState({
    seed: 0,
    water: 0,
    sunlight: 0,
    nutrients: 0,
    fertilizer: 0,
    love: 0
  });

  if (!isOpen) return null;

  const handleUnlockAll = () => {
    // Set developer mode flag
    localStorage.setItem('developerMode', 'true');
    
    // Unlock all major levels
    localStorage.setItem('unlockedLevels', JSON.stringify([
      'climate-kingdom', 'waste-realm', 'energy-empire'
    ]));
    
    // Unlock all sub-levels
    localStorage.setItem('unlockedSubLevels', JSON.stringify([
      'climate-1', 'climate-2', 'waste-1', 'waste-2', 'energy-1', 'energy-2'
    ]));
    
    // Unlock all games
    localStorage.setItem('unlockedGames', JSON.stringify([
      'warming-forest-game', 'greenhouse-puzzle', 'waste-sorting-game', 
      'recycling-puzzle', 'solar-city-builder', 'wind-farm-simulator'
    ]));
    
    window.location.reload();
  };

  const handleMaxResources = () => {
    addItems({
      seed: 50,
      water: 50,
      sunlight: 50,
      nutrients: 50,
      fertilizer: 50,
      love: 50
    });
  };

  const handleMaxTree = () => {
    // Set tree to forest stage
    upgradeStage('forest');
  };

  const handleAddCustomItems = () => {
    addItems(customItems);
  };

  const handleCompleteAllQuizzes = () => {
    // Complete some sample quizzes
    completeQuiz('climate-basics', 1000, { seed: 5, water: 3, sunlight: 3 });
    completeQuiz('waste-management', 1000, { nutrients: 4, fertilizer: 2 });
    completeQuiz('renewable-energy', 1000, { love: 3, nutrients: 2 });
  };

  const handleCompleteAllLessons = () => {
    // Complete some sample lessons
    completeLesson('lesson-1', 500, { water: 2, sunlight: 2, nutrients: 1 });
    completeLesson('lesson-2', 500, { fertilizer: 1, nutrients: 2 });
  };

  const handleCompleteAllGames = () => {
    // Complete some sample games
    completeGame('warming-forest-game', 300, { nutrients: 2, fertilizer: 1, love: 1 });
    completeGame('waste-sorting-game', 300, { nutrients: 2, fertilizer: 1, love: 1 });
    completeGame('greenhouse-puzzle', 300, { nutrients: 2, fertilizer: 1, love: 1 });
  };

  const handleCompleteAllChallenges = () => {
    // Complete some sample challenges
    completeChallenge('challenge-1', 400, { water: 3, sunlight: 3, nutrients: 2, fertilizer: 2, love: 2 });
    completeChallenge('challenge-2', 400, { water: 3, sunlight: 3, nutrients: 2, fertilizer: 2, love: 2 });
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleDisableDevMode = () => {
    localStorage.removeItem('developerMode');
    localStorage.removeItem('unlockedLevels');
    localStorage.removeItem('unlockedSubLevels');
    localStorage.removeItem('unlockedGames');
    window.location.reload();
  };

  const handleMaxXP = () => {
    // Add a lot of XP to level up
    completeQuiz('dev-xp', 10000, {});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Settings className="w-6 h-6" />
            Developer Mode
            <Badge variant="destructive" className="ml-2">DEV</Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={handleUnlockAll} className="h-20 flex flex-col items-center space-y-2">
              <Unlock className="w-6 h-6" />
              <span className="text-sm">Unlock All</span>
            </Button>
            
            <Button onClick={handleMaxResources} className="h-20 flex flex-col items-center space-y-2">
              <Gift className="w-6 h-6" />
              <span className="text-sm">Max Resources</span>
            </Button>
            
            <Button onClick={handleMaxTree} className="h-20 flex flex-col items-center space-y-2">
              <TreePine className="w-6 h-6" />
              <span className="text-sm">Max Tree</span>
            </Button>
            
            <Button onClick={handleMaxXP} className="h-20 flex flex-col items-center space-y-2">
              <Star className="w-6 h-6" />
              <span className="text-sm">Max XP</span>
            </Button>
          </div>

          {/* Custom Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(customItems).map(([item, value]) => (
                  <div key={item} className="space-y-2">
                    <Label htmlFor={item} className="capitalize">{item}</Label>
                    <Input
                      id={item}
                      type="number"
                      value={value}
                      onChange={(e) => setCustomItems(prev => ({
                        ...prev,
                        [item]: parseInt(e.target.value) || 0
                      }))}
                      min="0"
                    />
                  </div>
                ))}
              </div>
              <Button onClick={handleAddCustomItems} className="w-full">
                Add Custom Items
              </Button>
            </CardContent>
          </Card>

          {/* Complete All Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Complete All Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button onClick={handleCompleteAllQuizzes} variant="outline">
                  Complete Quizzes
                </Button>
                <Button onClick={handleCompleteAllLessons} variant="outline">
                  Complete Lessons
                </Button>
                <Button onClick={handleCompleteAllGames} variant="outline">
                  Complete Games
                </Button>
                <Button onClick={handleCompleteAllChallenges} variant="outline">
                  Complete Challenges
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Debug Info Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Debug Information
                <Switch
                  checked={showDebugInfo}
                  onCheckedChange={setShowDebugInfo}
                />
              </CardTitle>
            </CardHeader>
            {showDebugInfo && (
              <CardContent>
                <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
                  <pre>{JSON.stringify(userProgress, null, 2)}</pre>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold">{userProgress.level}</div>
                  <div className="text-gray-600">Level</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{userProgress.totalPoints}</div>
                  <div className="text-gray-600">XP</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{userProgress.currentStage}</div>
                  <div className="text-gray-600">Tree Stage</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">
                    {Object.values(userProgress.inventory?.items || {}).reduce((a, b) => a + b, 0)}
                  </div>
                  <div className="text-gray-600">Total Items</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Developer Mode Controls */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg text-purple-600">Developer Mode Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={handleDisableDevMode} 
                variant="outline" 
                className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                Disable Developer Mode
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleResetProgress} 
                variant="destructive" 
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Reset All Progress
              </Button>
            </CardContent>
          </Card>

          {/* Close Button */}
          <div className="flex justify-end">
            <Button onClick={onClose} className="px-8">
              Close Developer Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperMode;
