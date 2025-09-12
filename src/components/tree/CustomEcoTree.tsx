import React from 'react';
import { useProgress } from '@/contexts/ProgressContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Droplets, 
  Sun, 
  Sprout, 
  Leaf, 
  TreePine, 
  Zap,
  Heart,
  Sparkles
} from 'lucide-react';

const CustomEcoTree = () => {
  const { userProgress, canUpgradeStage, upgradeStage } = useProgress();

  // Safety check for userProgress
  if (!userProgress) {
    return (
      <Card className="custom-card bg-gradient-to-br from-green-50 to-blue-50 border-green-200 shadow-eco">
        <CardContent className="text-center py-8">
          <div className="text-6xl mb-4">🌱</div>
          <p className="text-green-600">Loading your tree...</p>
        </CardContent>
      </Card>
    );
  }

  const treeStages = {
    pot: {
      emoji: '🪴',
      title: 'Empty Pot',
      description: 'Ready for your first seed!',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    seed: {
      emoji: '🌱',
      title: 'Tiny Sprout',
      description: 'Your seed is growing!',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    sapling: {
      emoji: '🌿',
      title: 'Young Sapling',
      description: 'Growing strong and healthy!',
      color: 'text-green-700',
      bgColor: 'bg-green-200'
    },
    tree: {
      emoji: '🌳',
      title: 'Mighty Tree',
      description: 'A beautiful mature tree!',
      color: 'text-green-800',
      bgColor: 'bg-green-300'
    },
    forest: {
      emoji: '🌲',
      title: 'Forest Guardian',
      description: 'You\'ve created a forest!',
      color: 'text-green-900',
      bgColor: 'bg-green-400'
    }
  };

  const currentStageKey = userProgress.currentStage || 'pot';
  const currentStage = treeStages[currentStageKey as keyof typeof treeStages] || treeStages.pot;
  const nextStageName = currentStageKey === 'pot' ? 'seed' :
    currentStageKey === 'seed' ? 'sapling' :
    currentStageKey === 'sapling' ? 'tree' :
    currentStageKey === 'tree' ? 'forest' : null;

  const canUpgrade = nextStageName ? canUpgradeStage(nextStageName) : false;
  const requiredItems = currentStageKey === 'pot' ? 
    { seed: 1, water: 0, sunlight: 0, nutrients: 0 } :
    currentStageKey === 'seed' ? 
    { seed: 0, water: 2, sunlight: 1, nutrients: 1 } :
    currentStageKey === 'sapling' ? 
    { seed: 0, water: 3, sunlight: 2, nutrients: 2 } :
    currentStageKey === 'tree' ? 
    { seed: 0, water: 5, sunlight: 3, nutrients: 3 } :
    { seed: 0, water: 0, sunlight: 0, nutrients: 0 };

  const handleUpgrade = () => {
    if (canUpgrade && nextStageName) {
      upgradeStage(nextStageName);
    }
  };

  return (
    <Card className="custom-card bg-gradient-to-br from-green-50 to-blue-50 border-green-200 shadow-eco">
      <CardHeader className="text-center pb-4">
        <CardTitle className="custom-heading flex items-center justify-center gap-2 text-green-800">
          <span className="emoji-large tree-float">🌳</span>
          <span>My Eco Tree</span>
          <span className="emoji-large tree-float">🌳</span>
        </CardTitle>
        <p className="custom-body text-green-600 text-sm">Grow your tree by completing activities!</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tree Display */}
        <div className="text-center">
          <div className={`text-8xl mb-4 transition-all duration-500 ${currentStage.color}`}>
            {currentStage.emoji}
          </div>
          <h3 className={`text-xl font-bold ${currentStage.color} mb-2`}>
            {currentStage.title}
          </h3>
          <p className="text-green-600 text-sm mb-4">
            {currentStage.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-green-700">
            <span>Growth Progress</span>
            <span>{userProgress.level}%</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-3">
            <div 
              className="custom-progress h-3 rounded-full transition-all duration-500"
              style={{ width: `${userProgress.level}%` }}
            ></div>
          </div>
        </div>

        {/* Inventory */}
        <div className="space-y-3">
          <h4 className="font-semibold text-green-800 text-center">My Resources</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-green-200">
              <Sprout className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <div className="text-sm text-green-700">Seeds</div>
                <div className="font-bold text-green-800">{userProgress.inventory?.seed || 0}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-green-200">
              <Droplets className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <div className="text-sm text-blue-700">Water</div>
                <div className="font-bold text-blue-800">{userProgress.inventory?.water || 0}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-green-200">
              <Sun className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <div className="text-sm text-yellow-700">Sunlight</div>
                <div className="font-bold text-yellow-800">{userProgress.inventory?.sunlight || 0}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-green-200">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <div className="flex-1">
                <div className="text-sm text-emerald-700">Nutrients</div>
                <div className="font-bold text-emerald-800">{userProgress.inventory?.nutrients || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Section */}
        {nextStageName && (
          <div className="space-y-3">
            <div className="text-center">
              <h4 className="font-semibold text-green-800 mb-2">Next Stage: {treeStages[nextStageName]?.title}</h4>
              <div className="text-4xl mb-2">{treeStages[nextStageName]?.emoji}</div>
              <p className="text-green-600 text-sm">{treeStages[nextStageName]?.description}</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h5 className="font-semibold text-green-800 mb-2 text-center">Required Resources</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {requiredItems.seed > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Sprout className="w-4 h-4 text-green-600" />
                      Seeds
                    </span>
                    <span className={(userProgress.inventory?.seed || 0) >= requiredItems.seed ? 'text-green-600' : 'text-red-600'}>
                      {userProgress.inventory?.seed || 0}/{requiredItems.seed}
                    </span>
                  </div>
                )}
                {requiredItems.water > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-4 h-4 text-blue-600" />
                      Water
                    </span>
                    <span className={(userProgress.inventory?.water || 0) >= requiredItems.water ? 'text-green-600' : 'text-red-600'}>
                      {userProgress.inventory?.water || 0}/{requiredItems.water}
                    </span>
                  </div>
                )}
                {requiredItems.sunlight > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Sun className="w-4 h-4 text-yellow-600" />
                      Sunlight
                    </span>
                    <span className={(userProgress.inventory?.sunlight || 0) >= requiredItems.sunlight ? 'text-green-600' : 'text-red-600'}>
                      {userProgress.inventory?.sunlight || 0}/{requiredItems.sunlight}
                    </span>
                  </div>
                )}
                {requiredItems.nutrients > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      Nutrients
                    </span>
                    <span className={(userProgress.inventory?.nutrients || 0) >= requiredItems.nutrients ? 'text-green-600' : 'text-red-600'}>
                      {userProgress.inventory?.nutrients || 0}/{requiredItems.nutrients}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleUpgrade}
              disabled={!canUpgrade}
              className={`custom-button w-full ${
                canUpgrade 
                  ? 'gradient-eco hover:shadow-eco text-white hover-lift' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canUpgrade ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Grow Tree!
                </span>
              ) : (
                'Complete more activities to grow!'
              )}
            </Button>
          </div>
        )}

        {/* Max Level */}
        {userProgress.currentStage === 'forest' && (
          <div className="text-center space-y-2">
            <div className="text-6xl">🏆</div>
            <h4 className="font-bold text-green-800">Forest Guardian!</h4>
            <p className="text-green-600 text-sm">You've reached the highest level!</p>
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
              <Heart className="w-3 h-3 mr-1" />
              Master Environmentalist
            </Badge>
          </div>
        )}

        {/* Fun Facts */}
        <div className="bg-white rounded-lg p-3 border border-green-200">
          <h5 className="font-semibold text-green-800 mb-2 text-center">🌍 Did You Know?</h5>
          <p className="text-green-700 text-sm text-center">
            {userProgress.currentStage === 'pot' && "A single tree can absorb 48 pounds of CO2 per year!"}
            {userProgress.currentStage === 'seed' && "Trees help reduce air pollution by filtering harmful gases!"}
            {userProgress.currentStage === 'sapling' && "One mature tree produces enough oxygen for 4 people!"}
            {userProgress.currentStage === 'tree' && "Trees can live for hundreds or even thousands of years!"}
            {userProgress.currentStage === 'forest' && "Forests are home to 80% of the world's terrestrial biodiversity!"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomEcoTree;
