import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Lock, Clock, Star, Trophy, Camera, CheckCircle, Play, Trash2, Zap, Droplets, Leaf, Globe, Home, Sprout } from 'lucide-react';
import { Challenge } from '@/data/challenges';

interface ChallengeCardProps {
  challenge: Challenge;
  onStart: (challengeId: string) => void;
  onComplete: (challengeId: string) => void;
  userLevel: number;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'waste': return <Trash2 className="w-5 h-5" />;
    case 'energy': return <Zap className="w-5 h-5" />;
    case 'water': return <Droplets className="w-5 h-5" />;
    case 'biodiversity': return <Leaf className="w-5 h-5" />;
    case 'climate': return <Globe className="w-5 h-5" />;
    case 'lifestyle': return <Home className="w-5 h-5" />;
    default: return <Sprout className="w-5 h-5" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'daily': return 'bg-blue-100 text-blue-800';
    case 'weekly': return 'bg-purple-100 text-purple-800';
    case 'monthly': return 'bg-orange-100 text-orange-800';
    case 'special': return 'bg-pink-100 text-pink-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getVerificationIcon = (method: string) => {
  switch (method) {
    case 'photo': return <Camera className="w-4 h-4" />;
    case 'quiz': return <CheckCircle className="w-4 h-4" />;
    case 'timer': return <Clock className="w-4 h-4" />;
    case 'location': return <Star className="w-4 h-4" />;
    default: return <CheckCircle className="w-4 h-4" />;
  }
};

export default function ChallengeCard({ challenge, onStart, onComplete, userLevel }: ChallengeCardProps) {
  const canUnlock = !challenge.isLocked || 
    (challenge.requirements.level && userLevel >= challenge.requirements.level);

  const getTreeRewardsText = () => {
    const rewards = [];
    if (challenge.treeRewards.seed) rewards.push(`${challenge.treeRewards.seed} Seeds`);
    if (challenge.treeRewards.water) rewards.push(`${challenge.treeRewards.water} Water`);
    if (challenge.treeRewards.sunlight) rewards.push(`${challenge.treeRewards.sunlight} Sunlight`);
    if (challenge.treeRewards.nutrients) rewards.push(`${challenge.treeRewards.nutrients} Nutrients`);
    if (challenge.treeRewards.fertilizer) rewards.push(`${challenge.treeRewards.fertilizer} Fertilizer`);
    if (challenge.treeRewards.love) rewards.push(`${challenge.treeRewards.love} Love`);
    return rewards.join(' ');
  };

  const isComingSoon = challenge.tags.includes('coming-soon');

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg rounded-2xl border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 ${
      challenge.isLocked ? 'opacity-60' : 'hover:scale-105'
    } ${challenge.isCompleted ? 'ring-2 ring-green-500' : ''} ${isComingSoon ? 'ring-2 ring-yellow-300' : ''}`}>
      {challenge.isCompleted && (
        <div className="absolute top-2 right-2 z-10">
          <Trophy className="w-6 h-6 text-green-500" />
        </div>
      )}
      {isComingSoon && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            Coming Soon
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCategoryIcon(challenge.category)}</span>
            <div>
              <CardTitle className="text-lg font-semibold">{challenge.title}</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {challenge.description}
              </CardDescription>
            </div>
          </div>
          {challenge.isLocked && (
            <Lock className="w-5 h-5 text-gray-400" />
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge className={getTypeColor(challenge.type)}>
            {challenge.type}
          </Badge>
          <Badge className={getDifficultyColor(challenge.difficulty)}>
            {challenge.difficulty}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            {challenge.points} pts
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Progress Bar */}
          {challenge.progress !== undefined && challenge.maxProgress && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{challenge.progress}/{challenge.maxProgress}</span>
              </div>
              <Progress 
                value={(challenge.progress / challenge.maxProgress) * 100} 
                className="h-2"
              />
            </div>
          )}

          {/* Tree Rewards */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Tree Rewards:</span>
            <span className="text-green-600">{getTreeRewardsText()}</span>
          </div>

          {/* Verification Method */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {getVerificationIcon(challenge.verificationMethod)}
            <span>Verify by {challenge.verificationMethod}</span>
            <Clock className="w-4 h-4 ml-auto" />
            <span>{challenge.estimatedTime}</span>
          </div>

          {/* Instructions Preview */}
          <div className="space-y-1">
            <span className="text-sm font-medium">Instructions:</span>
            <ul className="text-xs text-gray-600 space-y-1">
              {challenge.instructions.slice(0, 2).map((instruction, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{instruction}</span>
                </li>
              ))}
              {challenge.instructions.length > 2 && (
                <li className="text-blue-500 text-xs">
                  +{challenge.instructions.length - 2} more steps
                </li>
              )}
            </ul>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {challenge.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {challenge.isCompleted ? (
              <Button disabled className="w-full bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </Button>
            ) : isComingSoon ? (
              <Button disabled className="w-full bg-yellow-100 text-yellow-800">
                <Clock className="w-4 h-4 mr-2" />
                Coming Soon
              </Button>
            ) : challenge.isLocked ? (
              <Button disabled className="w-full">
                <Lock className="w-4 h-4 mr-2" />
                Locked
              </Button>
            ) : (
              <Button 
                onClick={() => onStart(challenge.id)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Challenge
              </Button>
            )}
       