import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Droplets, 
  Sun, 
  Leaf, 
  Sprout, 
  Heart, 
  BookOpen, 
  Gamepad2, 
  Target, 
  Crown,
  Zap,
  Award
} from 'lucide-react';

const RewardMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState('lessons');

  const itemIcons = {
    water: <Droplets className="w-4 h-4 text-blue-500" />,
    sunlight: <Sun className="w-4 h-4 text-yellow-500" />,
    nutrients: <Leaf className="w-4 h-4 text-green-500" />,
    fertilizer: <Sprout className="w-4 h-4 text-emerald-500" />,
    love: <Heart className="w-4 h-4 text-red-500" />
  };

  const renderRewardItem = (item: string, amount: number) => (
    <div key={item} className="flex items-center space-x-1">
      {itemIcons[item as keyof typeof itemIcons]}
      <span className="text-sm font-medium">{amount}</span>
    </div>
  );

  const lessonRewards = [
    {
      category: 'Climate Change',
      color: 'bg-red-50 border-red-200',
      icon: '🌍',
      rewards: [
        { name: 'Climate Basics 1', difficulty: 'Beginner', water: 3, sunlight: 2, nutrients: 1, fertilizer: 1, love: 0, xp: 500 },
        { name: 'Climate Advanced 1', difficulty: 'Intermediate', water: 4, sunlight: 3, nutrients: 2, fertilizer: 2, love: 1, xp: 750 },
        { name: 'Climate Advanced 3', difficulty: 'Advanced', water: 5, sunlight: 4, nutrients: 3, fertilizer: 3, love: 2, xp: 1000 }
      ]
    },
    {
      category: 'Waste Management',
      color: 'bg-green-50 border-green-200',
      icon: '🗑️',
      rewards: [
        { name: 'Waste Basics 1', difficulty: 'Beginner', water: 2, sunlight: 2, nutrients: 3, fertilizer: 1, love: 0, xp: 500 },
        { name: 'Waste Advanced 1', difficulty: 'Intermediate', water: 3, sunlight: 3, nutrients: 4, fertilizer: 2, love: 1, xp: 750 },
        { name: 'Waste Advanced 3', difficulty: 'Advanced', water: 4, sunlight: 4, nutrients: 5, fertilizer: 3, love: 2, xp: 1000 }
      ]
    },
    {
      category: 'Renewable Energy',
      color: 'bg-yellow-50 border-yellow-200',
      icon: '⚡',
      rewards: [
        { name: 'Energy Basics 1', difficulty: 'Beginner', water: 2, sunlight: 4, nutrients: 1, fertilizer: 1, love: 0, xp: 500 },
        { name: 'Energy Advanced 1', difficulty: 'Intermediate', water: 3, sunlight: 5, nutrients: 2, fertilizer: 2, love: 1, xp: 750 },
        { name: 'Energy Advanced 3', difficulty: 'Advanced', water: 4, sunlight: 6, nutrients: 3, fertilizer: 3, love: 2, xp: 1000 }
      ]
    },
    {
      category: 'Conservation',
      color: 'bg-blue-50 border-blue-200',
      icon: '🌱',
      rewards: [
        { name: 'Conservation Basics 1', difficulty: 'Beginner', water: 2, sunlight: 2, nutrients: 1, fertilizer: 3, love: 1, xp: 500 },
        { name: 'Conservation Advanced 1', difficulty: 'Intermediate', water: 3, sunlight: 3, nutrients: 2, fertilizer: 4, love: 2, xp: 750 },
        { name: 'Conservation Advanced 3', difficulty: 'Advanced', water: 4, sunlight: 4, nutrients: 3, fertilizer: 5, love: 3, xp: 1000 }
      ]
    }
  ];

  const quizRewards = [
    { name: 'Climate Quiz (Beginner)', water: 2, sunlight: 1, nutrients: 1, fertilizer: 1, love: 0, xp: 300 },
    { name: 'Waste Quiz (Intermediate)', water: 2, sunlight: 2, nutrients: 3, fertilizer: 1, love: 0, xp: 400 },
    { name: 'Energy Quiz (Advanced)', water: 3, sunlight: 5, nutrients: 2, fertilizer: 2, love: 1, xp: 500 }
  ];

  const challengeRewards = [
    { name: 'Water Conservation (Easy)', water: 3, sunlight: 1, nutrients: 1, fertilizer: 1, love: 0, xp: 200 },
    { name: 'Energy Saving (Medium)', water: 2, sunlight: 4, nutrients: 1, fertilizer: 1, love: 0, xp: 300 },
    { name: 'Waste Reduction (Hard)', water: 3, sunlight: 3, nutrients: 5, fertilizer: 2, love: 1, xp: 400 }
  ];

  const gameRewards = [
    { name: 'Waste Sorting Master', water: 2, sunlight: 1, nutrients: 4, fertilizer: 1, love: 0, xp: 300 },
    { name: 'Temperature Rising', water: 3, sunlight: 2, nutrients: 1, fertilizer: 1, love: 0, xp: 300 },
    { name: 'Greenhouse Gas Puzzle', water: 2, sunlight: 3, nutrients: 2, fertilizer: 2, love: 1, xp: 300 }
  ];

  const treeStages = [
    { stage: 'Pot → Seed', water: 0, sunlight: 0, nutrients: 0, fertilizer: 0, love: 0, special: 'Seed (1)' },
    { stage: 'Seed → Sapling', water: 1, sunlight: 1, nutrients: 0, fertilizer: 0, love: 0, special: '-' },
    { stage: 'Sapling → Growing', water: 2, sunlight: 2, nutrients: 1, fertilizer: 0, love: 0, special: '-' },
    { stage: 'Growing → Mature', water: 2, sunlight: 2, nutrients: 2, fertilizer: 0, love: 0, special: '-' },
    { stage: 'Mature → Blooming', water: 3, sunlight: 3, nutrients: 2, fertilizer: 1, love: 0, special: '-' },
    { stage: 'Blooming → Tree', water: 3, sunlight: 3, nutrients: 3, fertilizer: 1, love: 1, special: '-' },
    { stage: 'Tree → Forest', water: 5, sunlight: 5, nutrients: 5, fertilizer: 2, love: 2, special: '-' }
  ];

  const renderRewardCard = (reward: any, showDifficulty = false) => (
    <div key={reward.name} className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">{reward.name}</h4>
        {showDifficulty && (
          <Badge variant={reward.difficulty === 'Advanced' ? 'destructive' : reward.difficulty === 'Intermediate' ? 'default' : 'secondary'}>
            {reward.difficulty}
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {reward.water > 0 && renderRewardItem('water', reward.water)}
        {reward.sunlight > 0 && renderRewardItem('sunlight', reward.sunlight)}
        {reward.nutrients > 0 && renderRewardItem('nutrients', reward.nutrients)}
        {reward.fertilizer > 0 && renderRewardItem('fertilizer', reward.fertilizer)}
        {reward.love > 0 && renderRewardItem('love', reward.love)}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-yellow-600">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">{reward.xp} XP</span>
        </div>
        {reward.special && reward.special !== '-' && (
          <Badge variant="outline" className="text-xs">
            {reward.special}
          </Badge>
        )}
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="w-6 h-6 text-yellow-500" />
          <span>Reward System Map</span>
        </CardTitle>
        <p className="text-gray-600">Complete activities to earn items and grow your eco tree!</p>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="lessons" className="flex items-center space-x-1">
              <BookOpen className="w-4 h-4" />
              <span>Lessons</span>
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>Quizzes</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center space-x-1">
              <Crown className="w-4 h-4" />
              <span>Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center space-x-1">
              <Gamepad2 className="w-4 h-4" />
              <span>Games</span>
            </TabsTrigger>
            <TabsTrigger value="tree" className="flex items-center space-x-1">
              <Sprout className="w-4 h-4" />
              <span>Tree Growth</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="space-y-6">
            {lessonRewards.map((category) => (
              <div key={category.category} className={`p-4 rounded-lg border ${category.color}`}>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="text-xl font-bold">{category.category}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {category.rewards.map((reward) => renderRewardCard(reward, true))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizRewards.map((reward) => renderRewardCard(reward))}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {challengeRewards.map((reward) => renderRewardCard(reward))}
            </div>
          </TabsContent>

          <TabsContent value="games" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gameRewards.map((reward) => renderRewardCard(reward))}
            </div>
          </TabsContent>

          <TabsContent value="tree" className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center space-x-2">
                <Sprout className="w-6 h-6" />
                <span>Tree Growth Requirements</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {treeStages.map((stage) => (
                  <div key={stage.stage} className="p-4 bg-white rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3">{stage.stage}</h4>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {stage.water > 0 && renderRewardItem('water', stage.water)}
                      {stage.sunlight > 0 && renderRewardItem('sunlight', stage.sunlight)}
                      {stage.nutrients > 0 && renderRewardItem('nutrients', stage.nutrients)}
                      {stage.fertilizer > 0 && renderRewardItem('fertilizer', stage.fertilizer)}
                      {stage.love > 0 && renderRewardItem('love', stage.love)}
                    </div>
                    {stage.special !== '-' && (
                      <Badge variant="outline" className="text-xs">
                        {stage.special}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RewardMap;
