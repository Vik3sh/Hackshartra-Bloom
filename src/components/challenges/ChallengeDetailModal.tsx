import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  Camera, 
  CheckCircle, 
  Star, 
  Trophy, 
  Play, 
  Upload, 
  MapPin,
  Calendar,
  Target,
  Award
} from 'lucide-react';
import { Challenge } from '@/data/challenges';

interface ChallengeDetailModalProps {
  challenge: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
  onStart: (challengeId: string) => void;
  onComplete: (challengeId: string) => void;
  userLevel: number;
}

export default function ChallengeDetailModal({ 
  challenge, 
  isOpen, 
  onClose, 
  onStart, 
  onComplete, 
  userLevel 
}: ChallengeDetailModalProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [verificationFile, setVerificationFile] = useState<File | null>(null);

  if (!challenge) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'waste': return '🗑️';
      case 'energy': return '⚡';
      case 'water': return '💧';
      case 'biodiversity': return '🌿';
      case 'climate': return '🌍';
      case 'lifestyle': return '🏠';
      default: return '🌱';
    }
  };

  const getVerificationIcon = (method: string) => {
    switch (method) {
      case 'photo': return <Camera className="w-5 h-5" />;
      case 'quiz': return <CheckCircle className="w-5 h-5" />;
      case 'timer': return <Clock className="w-5 h-5" />;
      case 'location': return <MapPin className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getTreeRewardsText = () => {
    const rewards = [];
    if (challenge.treeRewards.seed) rewards.push(`${challenge.treeRewards.seed} 🌱 Seeds`);
    if (challenge.treeRewards.water) rewards.push(`${challenge.treeRewards.water} 💧 Water`);
    if (challenge.treeRewards.sunlight) rewards.push(`${challenge.treeRewards.sunlight} ☀️ Sunlight`);
    if (challenge.treeRewards.nutrients) rewards.push(`${challenge.treeRewards.nutrients} 🌿 Nutrients`);
    if (challenge.treeRewards.fertilizer) rewards.push(`${challenge.treeRewards.fertilizer} 🧪 Fertilizer`);
    if (challenge.treeRewards.love) rewards.push(`${challenge.treeRewards.love} ❤️ Love`);
    return rewards;
  };

  const handleStart = async () => {
    setIsStarting(true);
    try {
      await onStart(challenge.id);
    } finally {
      setIsStarting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVerificationFile(file);
    }
  };

  const canUnlock = !challenge.isLocked || 
    (challenge.requirements.level && userLevel >= challenge.requirements.level);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getCategoryIcon(challenge.category)}</span>
            <div>
              <DialogTitle className="text-2xl">{challenge.title}</DialogTitle>
              <DialogDescription className="text-base">
                {challenge.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Challenge Info */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getTypeColor(challenge.type)}>
              {challenge.type}
            </Badge>
            <Badge className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {challenge.points} points
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {challenge.estimatedTime}
            </Badge>
          </div>

          {/* Progress */}
          {challenge.progress !== undefined && challenge.maxProgress && (
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{challenge.progress}/{challenge.maxProgress}</span>
                  </div>
                  <Progress 
                    value={(challenge.progress / challenge.maxProgress) * 100} 
                    className="h-3"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rewards */}
          <Card>
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Rewards
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Points</p>
                  <p className="text-lg font-bold text-blue-600">{challenge.points} pts</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Tree Items</p>
                  <div className="space-y-1">
                    {getTreeRewardsText().map((reward, index) => (
                      <p key={index} className="text-sm text-green-600">{reward}</p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Instructions
              </h3>
              <ol className="space-y-2">
                {challenge.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Verification */}
          <Card>
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                {getVerificationIcon(challenge.verificationMethod)}
                Verification Method
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  This challenge requires verification by <strong>{challenge.verificationMethod}</strong>
                </p>
                
                {challenge.verificationMethod === 'photo' && (
                  <div className="space-y-2">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        📸 <strong>Photo Verification Coming Soon</strong><br/>
                        Upload feature will be available in the next update.
                      </p>
                    </div>
                    <label className="block text-sm font-medium text-gray-700">
                      Upload verification photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      disabled
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-500 cursor-not-allowed"
                    />
                  </div>
                )}

                {challenge.verificationMethod === 'quiz' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      🧠 <strong>Quiz Verification Available</strong><br/>
                      Complete the related quiz to verify your challenge completion.
                    </p>
                  </div>
                )}

                {challenge.verificationMethod === 'timer' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      ⏰ <strong>Timer Verification Coming Soon</strong><br/>
                      Automatic verification will be available in the next update.
                    </p>
                  </div>
                )}

                {challenge.verificationMethod === 'location' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      📍 <strong>Location Verification Coming Soon</strong><br/>
                      GPS verification will be available in the next update.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          {challenge.requirements.level && (
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  Requirements
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Minimum Level</span>
                    <Badge variant={userLevel >= challenge.requirements.level ? "default" : "destructive"}>
                      Level {challenge.requirements.level}
                    </Badge>
                  </div>
                  {challenge.requirements.completedChallenges && challenge.requirements.completedChallenges.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-600">Prerequisites</span>
                      <div className="mt-1 space-y-1">
                        {challenge.requirements.completedChallenges.map((challengeId, index) => (
                          <Badge key={index} variant="outline" className="text-xs mr-1">
                            {challengeId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Tags</h3>
            <div className="flex flex-wrap gap-1">
              {challenge.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {challenge.isCompleted ? (
              <Button disabled className="flex-1 bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </Button>
            ) : !canUnlock ? (
              <Button disabled className="flex-1">
                <Clock className="w-4 h-4 mr-2" />
                Locked
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleStart}
                  disabled={isStarting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isStarting ? 'Starting...' : 'Start Challenge'}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
