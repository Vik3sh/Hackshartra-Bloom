import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

const DevModeTest: React.FC = () => {
  const [devModeStatus, setDevModeStatus] = useState<string>('Unknown');
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>([]);
  const [unlockedGames, setUnlockedGames] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check developer mode status
    const isDevMode = localStorage.getItem('developerMode') === 'true';
    setDevModeStatus(isDevMode ? 'Enabled' : 'Disabled');
    
    // Check unlocked levels
    const levels = localStorage.getItem('unlockedLevels');
    setUnlockedLevels(levels ? JSON.parse(levels) : []);
    
    // Check unlocked games
    const games = localStorage.getItem('unlockedGames');
    setUnlockedGames(games ? JSON.parse(games) : []);
  }, []);

  const testUnlockAll = () => {
    localStorage.setItem('developerMode', 'true');
    localStorage.setItem('unlockedLevels', JSON.stringify(['climate-kingdom', 'waste-realm', 'energy-empire']));
    localStorage.setItem('unlockedGames', JSON.stringify(['warming-forest-game', 'greenhouse-puzzle', 'waste-sorting-game']));
    
    // Refresh status
    setDevModeStatus('Enabled');
    setUnlockedLevels(['climate-kingdom', 'waste-realm', 'energy-empire']);
    setUnlockedGames(['warming-forest-game', 'greenhouse-puzzle', 'waste-sorting-game']);
  };

  const testDisableDevMode = () => {
    localStorage.removeItem('developerMode');
    localStorage.removeItem('unlockedLevels');
    localStorage.removeItem('unlockedGames');
    
    // Refresh status
    setDevModeStatus('Disabled');
    setUnlockedLevels([]);
    setUnlockedGames([]);
  };

  if (!isVisible) return null;

  return (
    <Card className="w-80 bg-white shadow-lg border-2 border-purple-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-purple-700">Dev Mode Test</CardTitle>
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
          <div className="flex items-center justify-between">
            <span>Developer Mode:</span>
            <Badge variant={devModeStatus === 'Enabled' ? 'default' : 'secondary'}>
              {devModeStatus}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm font-medium">Unlocked Levels:</span>
            <div className="text-xs text-gray-600">
              {unlockedLevels.length > 0 ? unlockedLevels.join(', ') : 'None'}
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm font-medium">Unlocked Games:</span>
            <div className="text-xs text-gray-600">
              {unlockedGames.length > 0 ? unlockedGames.join(', ') : 'None'}
            </div>
          </div>
        </div>
        
          <div className="flex space-x-2">
            <Button onClick={testUnlockAll} size="sm" className="flex-1 text-xs">
              Unlock All
            </Button>
            <Button onClick={testDisableDevMode} size="sm" variant="outline" className="flex-1 text-xs">
              Disable
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DevModeTest;
