import React, { useState, useEffect } from 'react';
import { useProgress } from '@/contexts/ProgressContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { STAGE_REQUIREMENTS } from '@/types/items';
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
  const [showRewardNotification, setShowRewardNotification] = useState(false);
  const [recentRewards, setRecentRewards] = useState<{[key: string]: number}>({});

  // Show reward notification when items change
  useEffect(() => {
    const items = userProgress.inventory?.items || {};
    const hasItems = Object.values(items).some(count => count > 0);
    
    if (hasItems) {
      setShowRewardNotification(true);
      setRecentRewards(items);
      
      // Hide notification after 3 seconds
      const timer = setTimeout(() => {
        setShowRewardNotification(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [userProgress.inventory?.items]);

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
      emoji: '🫗',
      title: 'Empty Pot',
      description: 'Ready for your first seed!',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      image: '/assets/tree-stages/pot.png'
    },
    seed: {
      emoji: '🌱',
      title: 'Tiny Sprout',
      description: 'Your seed is growing!',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      image: '/assets/tree-stages/seed.png'
    },
    sapling: {
      emoji: '🌿',
      title: 'Young Sapling',
      description: 'Growing strong and healthy!',
      color: 'text-green-700',
      bgColor: 'bg-green-200',
      image: '/assets/tree-stages/sapling.png'
    },
    growing: {
      emoji: '🌳',
      title: 'Growing Tree',
      description: 'Your tree is getting bigger!',
      color: 'text-green-800',
      bgColor: 'bg-green-300',
      image: '/assets/tree-stages/growing.png'
    },
    mature: {
      emoji: '🌳',
      title: 'Mature Tree',
      description: 'A beautiful mature tree!',
      color: 'text-green-800',
      bgColor: 'bg-green-300',
      image: '/assets/tree-stages/mature.png'
    },
    blooming: {
      emoji: '🌸',
      title: 'Blooming Tree',
      description: 'Your tree is in full bloom!',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      image: '/assets/tree-stages/blooming.png'
    },
    tree: {
      emoji: '🌳',
      title: 'Mighty Tree',
      description: 'A beautiful mature tree!',
      color: 'text-green-800',
      bgColor: 'bg-green-300',
      image: '/assets/tree-stages/tree.png'
    },
    forest: {
      emoji: '🌲',
      title: 'Forest Guardian',
      description: 'You\'ve created a forest!',
      color: 'text-green-900',
      bgColor: 'bg-green-400',
      image: '/assets/tree-stages/forest.png'
    }
  };

  const currentStageKey = userProgress.currentStage || 'pot';
  const currentStage = treeStages[currentStageKey as keyof typeof treeStages] || treeStages.pot;
  const nextStageName = currentStageKey === 'pot' ? 'seed' :
    currentStageKey === 'seed' ? 'sapling' :
    currentStageKey === 'sapling' ? 'growing' :
    currentStageKey === 'growing' ? 'mature' :
    currentStageKey === 'mature' ? 'blooming' :
    currentStageKey === 'blooming' ? 'tree' :
    currentStageKey === 'tree' ? 'forest' : null;

  const canUpgrade = nextStageName ? canUpgradeStage(nextStageName) : false;
  const requiredItems = nextStageName ? STAGE_REQUIREMENTS[nextStageName] : {};

  const handleUpgrade = () => {
    console.log('Upgrade clicked:', { canUpgrade, nextStageName, currentStageKey, requiredItems });
    if (canUpgrade && nextStageName) {
      const success = upgradeStage(nextStageName);
      console.log('Upgrade result:', success);
    }
  };

  return (
    <Card className="custom-card bg-gradient-to-br from-green-50 to-blue-50 border-green-200 shadow-eco relative">
      {/* Reward Notification */}
      {showRewardNotification && (
        <div className="absolute -top-2 -right-2 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
          +{Object.values(recentRewards).reduce((sum, count) => sum + count, 0)} Items!
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tree Display */}
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Try to load image first, fallback to emoji */}
              {currentStage.image ? (
                <img 
                  src={currentStage.image} 
                  alt={currentStage.title}
                  className="w-full h-full object-contain transition-all duration-500"
                  onError={(e) => {
                    // Hide image and show emoji fallback
                    e.currentTarget.style.display = 'none';
                    const emojiElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (emojiElement) emojiElement.style.display = 'block';
                  }}
                />
              ) : null}
              <div 
                className={`text-8xl transition-all duration-500 ${currentStage.color}`}
                style={{ display: currentStage.image ? 'none' : 'block' }}
              >
                {currentStageKey === 'pot' ? (
                  <div className="relative">
                    {/* Empty Pot */}
                    <div className="w-24 h-20 bg-gradient-to-b from-orange-200 to-orange-400 rounded-b-lg border-2 border-orange-300">
                      {/* Pot rim */}
                      <div className="absolute -top-1 left-0 right-0 h-2 bg-orange-300 rounded-t-lg"></div>
                      {/* Empty inside */}
                      <div className="absolute top-2 left-2 right-2 bottom-2 bg-orange-100 rounded-b-md"></div>
                    </div>
                    {/* Soil line */}
                    <div className="absolute bottom-2 left-2 right-2 h-1 bg-amber-600 rounded-full"></div>
                  </div>
                ) : (
                  currentStage.emoji
                )}
              </div>
            </div>
          </div>
          <h3 className={`text-xl font-bold ${currentStage.color} mb-2`}>
            {currentStage.title}
          </h3>
          <p className="text-green-600 text-sm mb-4">
            {currentStage.description}
          </p>
          {/* Debug info */}
          <div className="text-xs text-gray-500 mb-2">
            Stage: {currentStageKey} | Next: {nextStageName || 'None'} | Can Upgrade: {canUpgrade ? 'Yes' : 'No'}
          </div>
        </div>

        {/* XP and Level Display */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-sm font-bold">XP</span>
                </div>
                <span className="font-semibold text-gray-800">Experience Points</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-600">{userProgress.totalPoints.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Level {userProgress.level}</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (userProgress.totalPoints % 100) / 100 * 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {userProgress.pointsToNextLevel} XP to next level
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <h4 className="font-semibold text-green-800">My Resources</h4>
            <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Earn from quizzes!
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-white rounded-lg p-3 border-2 border-green-200 hover:border-green-300 transition-colors">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Sprout className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-green-700 font-medium">Seeds</div>
                <div className="text-lg font-bold text-green-800">{userProgress.inventory?.items?.seed || 0}</div>
                <div className="text-xs text-green-600">From Beginner quizzes only</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg p-3 border-2 border-blue-200 hover:border-blue-300 transition-colors">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Droplets className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-blue-700 font-medium">Water</div>
                <div className="text-lg font-bold text-blue-800">{userProgress.inventory?.items?.water || 0}</div>
                <div className="text-xs text-blue-600">From Intermediate quizzes & lessons</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg p-3 border-2 border-yellow-200 hover:border-yellow-300 transition-colors">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Sun className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-yellow-700 font-medium">Sunlight</div>
                <div className="text-lg font-bold text-yellow-800">{userProgress.inventory?.items?.sunlight || 0}</div>
                <div className="text-xs text-yellow-600">From Advanced quizzes & lessons</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg p-3 border-2 border-emerald-200 hover:border-emerald-300 transition-colors">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <Leaf className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-emerald-700 font-medium">Nutrients</div>
                <div className="text-lg font-bold text-emerald-800">{userProgress.inventory?.items?.nutrients || 0}</div>
                <div className="text-xs text-emerald-600">From lessons & games</div>
              </div>
            </div>
          </div>
          
          {/* Advanced Resources Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-white rounded-lg p-3 border-2 border-purple-200 hover:border-purple-300 transition-colors">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-purple-700 font-medium">Fertilizer</div>
                <div className="text-lg font-bold text-purple-800">{userProgress.inventory?.items?.fertilizer || 0}</div>
                <div className="text-xs text-purple-600">From lessons & challenges</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg p-3 border-2 border-pink-200 hover:border-pink-300 transition-colors">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-pink-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-pink-700 font-medium">Love</div>
                <div className="text-lg font-bold text-pink-800">{userProgress.inventory?.items?.love || 0}</div>
                <div className="text-xs text-pink-600">From games & challenges</div>
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
                    <span className={(userProgress.inventory?.items?.seed || 0) >= requiredItems.seed ? 'text-green-600' : 'text-red-600'}>
                      {userProgress.inventory?.items?.seed || 0}/{requiredItems.seed}
                    </span>
                  </div>
                )}
                {requiredItems.water > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-4 h-4 text-blue-600" />
                      Water
                    </span>
                    <span className={(userProgress.inventory?.items?.water || 0) >= requiredItems.water ? 'text-green-600' : 'text-red-600'}>
                      {userProgress.inventory?.items?.water || 0}/{requiredItems.water}
                    </span>
                  </div>
                )}
                {requiredItems.sunlight > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Sun className="w-4 h-4 text-yellow-600" />
                      Sunlight
                    </span>
                    <span className={(userProgress.inventory?.items?.sunlight || 0) >= requiredItems.sunlight ? 'text-green-600' : 'text-red-600'}>
                      {userProgress.inventory?.items?.sunlight || 0}/{requiredItems.sunlight}
                    </span>
                  </div>
                )}
                {requiredItems.nutrients > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      Nutrients
                    </span>
                    <span className={(userProgress.inventory?.items?.nutrients || 0) >= requiredItems.nutrients ? 'text-green-600' : 'text-red-600'}>
                      {userProgress.inventory?.items?.nutrients || 0}/{requiredItems.nutrients}
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

        {/* Empty Pot - Show helpful message */}
        {userProgress.currentStage === 'pot' && (!userProgress.inventory?.items || Object.values(userProgress.inventory.items).every(count => count === 0)) && (
          <div className="text-center space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-4xl">🪴</div>
            <h4 className="font-bold text-gray-700">Your Tree Awaits!</h4>
            <p className="text-gray-600 text-sm">Complete quizzes and challenges to earn items for your tree.</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1 text-green-600">
                <Sprout className="w-4 h-4" />
                <span>Seeds from quizzes</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <Droplets className="w-4 h-4" />
                <span>Water from challenges</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-600">
                <Sun className="w-4 h-4" />
                <span>Sunlight from lessons</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <Leaf className="w-4 h-4" />
                <span>Nutrients from games</span>
              </div>
            </div>
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
