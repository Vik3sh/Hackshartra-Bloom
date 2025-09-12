// EcoTree Component - Dynamic tree that grows based on collected items
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/contexts/ProgressContext';
import { TREE_ITEMS, STAGE_REQUIREMENTS, TreeStage } from '@/types/items';
import { 
  Leaf, 
  Sprout, 
  TreePine, 
  Flower2, 
  Zap,
  Trophy,
  Target,
  ArrowUp
} from 'lucide-react';

interface EcoTreeProps {
  isDarkMode?: boolean;
}

const EcoTree: React.FC<EcoTreeProps> = ({ isDarkMode = false }) => {
  const { userProgress, canUpgradeStage, upgradeStage } = useProgress();
  const { totalPoints, level, pointsToNextLevel, completedQuizzes, completedChallenges, inventory } = userProgress;
  const currentStage = inventory.currentStage;

  // Tree stage configurations
  const treeStages = {
    pot: {
      title: "Empty Pot",
      description: "Complete your first quiz to get a seed!",
      icon: "🪴",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      borderColor: "border-gray-300",
      nextStage: "seed"
    },
    seed: {
      title: "Planted Seed",
      description: "Great! Now collect water to help it grow.",
      icon: "🌱",
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-300",
      nextStage: "sapling"
    },
    sapling: {
      title: "Young Sapling",
      description: "Growing well! Collect sunlight for more growth.",
      icon: "🌿",
      color: "text-green-700",
      bgColor: "bg-green-200",
      borderColor: "border-green-400",
      nextStage: "growing"
    },
    growing: {
      title: "Growing Tree",
      description: "Strong growth! Collect nutrients for maturity.",
      icon: "🌳",
      color: "text-green-800",
      bgColor: "bg-green-300",
      borderColor: "border-green-500",
      nextStage: "mature"
    },
    mature: {
      title: "Mature Tree",
      description: "Fully grown! Collect fertilizer and love for blooming.",
      icon: "🌲",
      color: "text-green-900",
      bgColor: "bg-green-400",
      borderColor: "border-green-600",
      nextStage: "blooming"
    },
    blooming: {
      title: "Blooming Tree",
      description: "Incredible! Your tree is in full bloom with flowers!",
      icon: "🌸",
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      borderColor: "border-pink-300",
      nextStage: null
    }
  };

  const currentStageInfo = treeStages[currentStage];
  const nextStageName = currentStageInfo.nextStage;
  const nextStageInfo = nextStageName ? treeStages[nextStageName] : null;
  
  // Check if user can upgrade to next stage
  const canUpgrade = nextStageName ? canUpgradeStage(nextStageName) : false;
  
  // Get required items for next stage
  const requiredItems = nextStageName ? STAGE_REQUIREMENTS[nextStageName] : {};
  const currentItems = inventory.items;

  // Calculate progress based on collected items
  const getItemProgress = () => {
    if (!nextStageName) return { progress: 100, collected: 0, total: 0 };
    
    let collected = 0;
    let total = 0;
    
    for (const [itemId, requiredQuantity] of Object.entries(requiredItems)) {
      total += requiredQuantity;
      collected += Math.min(currentItems[itemId] || 0, requiredQuantity);
    }
    
    return {
      progress: total > 0 ? (collected / total) * 100 : 0,
      collected,
      total
    };
  };

  const itemProgress = getItemProgress();

  const handleUpgrade = () => {
    if (nextStageName && canUpgrade) {
      upgradeStage(nextStageName);
    }
  };

  return (
    <Card className={`bg-white border-blue-200 shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
      <CardHeader>
        <CardTitle className={`text-blue-900 ${isDarkMode ? 'text-white' : ''}`}>
          Your Eco Tree
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tree Display */}
        <div className="text-center">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-6xl mb-4 ${currentStageInfo.bgColor} ${currentStageInfo.borderColor} border-2`}>
            {currentStageInfo.icon}
          </div>
          <h3 className={`text-lg font-semibold ${currentStageInfo.color} mb-2`}>
            {currentStageInfo.title}
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            {currentStageInfo.description}
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-4">
            <p className="text-xs text-yellow-800">
              🌱 <strong>Tree Customization Coming Soon!</strong> More tree types and decorations will be available.
            </p>
          </div>
        </div>

        {/* Progress to Next Stage */}
        {nextStageName && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Progress to {nextStageInfo?.title}
              </span>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {itemProgress.collected}/{itemProgress.total} items
              </span>
            </div>
            <Progress value={itemProgress.progress} className="h-2" />
            <div className="text-center">
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {Math.round(itemProgress.progress)}% complete
              </span>
            </div>
            
            {/* Required Items Display */}
            <div className="space-y-2">
              <h4 className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Required Items:
              </h4>
              <div className="flex flex-wrap gap-1 justify-center">
                {Object.entries(requiredItems).map(([itemId, requiredQuantity]) => {
                  const item = TREE_ITEMS.find(i => i.id === itemId);
                  const collected = currentItems[itemId] || 0;
                  const isComplete = collected >= requiredQuantity;
                  
                  return item ? (
                    <div
                      key={itemId}
                      className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                        isComplete 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{collected}/{requiredQuantity}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Upgrade Button */}
            {canUpgrade && (
              <Button
                onClick={handleUpgrade}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <ArrowUp className="w-4 h-4 mr-2" />
                Upgrade to {nextStageInfo?.title}
              </Button>
            )}
          </div>
        )}

        {/* Current Stats */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Zap className="w-4 h-4 text-blue-600 mr-1" />
                <span className="text-sm font-medium text-blue-700">Points</span>
              </div>
              <div className="text-lg font-bold text-blue-800">{totalPoints}</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Trophy className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-700">Level</span>
              </div>
              <div className="text-lg font-bold text-green-800">{level}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Target className="w-4 h-4 text-purple-600 mr-1" />
                <span className="text-sm font-medium text-purple-700">Quizzes</span>
              </div>
              <div className="text-lg font-bold text-purple-800">{completedQuizzes}</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Flower2 className="w-4 h-4 text-orange-600 mr-1" />
                <span className="text-sm font-medium text-orange-700">Challenges</span>
              </div>
              <div className="text-lg font-bold text-orange-800">{completedChallenges}</div>
            </div>
          </div>
        </div>

        {/* Tree Growth Tips */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <h4 className={`text-sm font-semibold text-green-800 mb-2 ${isDarkMode ? 'text-green-300' : ''}`}>
            🌱 Growth Tips
          </h4>
          <ul className={`text-xs space-y-1 ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>
            <li>• Complete quizzes to earn points</li>
            <li>• Take on challenges for bonus growth</li>
            <li>• Maintain a learning streak</li>
            <li>• Explore all environmental topics</li>
          </ul>
        </div>

        {/* Next Stage Preview */}
        {nextStageName && (
          <div className="text-center">
            <Badge variant="outline" className={`${nextStageInfo?.color} ${nextStageInfo?.borderColor}`}>
              Next: {nextStageInfo?.title}
            </Badge>
          </div>
        )}

        {/* Max Level Achievement */}
        {!nextStageName && (
          <div className="text-center">
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              🌸 Master Gardener
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EcoTree;
