import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid, List } from 'lucide-react';
import ChallengeCard from './ChallengeCard';
import { Challenge, getChallengesByType, getChallengesByCategory } from '@/data/challenges';

interface ChallengeGridProps {
  challenges: Challenge[];
  onStartChallenge: (challengeId: string) => void;
  onCompleteChallenge: (challengeId: string) => void;
  userLevel: number;
}

export default function ChallengeGrid({ 
  challenges, 
  onStartChallenge, 
  onCompleteChallenge, 
  userLevel 
}: ChallengeGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || challenge.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const dailyChallenges = getChallengesByType('daily');
  const weeklyChallenges = getChallengesByType('weekly');
  const monthlyChallenges = getChallengesByType('monthly');
  const specialChallenges = getChallengesByType('special');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'waste', label: 'Waste Management' },
    { value: 'energy', label: 'Energy Conservation' },
    { value: 'water', label: 'Water Conservation' },
    { value: 'biodiversity', label: 'Biodiversity' },
    { value: 'climate', label: 'Climate Action' },
    { value: 'lifestyle', label: 'Lifestyle' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Environmental Challenges</h2>
          <p className="text-gray-600">Complete challenges to grow your eco-tree and earn rewards!</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            Level {userLevel}
          </Badge>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search challenges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map(difficulty => (
              <SelectItem key={difficulty.value} value={difficulty.value}>
                {difficulty.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Challenge Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({filteredChallenges.length})</TabsTrigger>
          <TabsTrigger value="daily">Daily ({dailyChallenges.length})</TabsTrigger>
          <TabsTrigger value="weekly">Weekly ({weeklyChallenges.length})</TabsTrigger>
          <TabsTrigger value="monthly">Monthly ({monthlyChallenges.length})</TabsTrigger>
          <TabsTrigger value="special">Special ({specialChallenges.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ChallengeGridContent 
            challenges={filteredChallenges}
            onStartChallenge={onStartChallenge}
            onCompleteChallenge={onCompleteChallenge}
            userLevel={userLevel}
            viewMode={viewMode}
          />
        </TabsContent>

        <TabsContent value="daily" className="mt-6">
          <ChallengeGridContent 
            challenges={dailyChallenges.filter(c => 
              c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            )}
            onStartChallenge={onStartChallenge}
            onCompleteChallenge={onCompleteChallenge}
            userLevel={userLevel}
            viewMode={viewMode}
          />
        </TabsContent>

        <TabsContent value="weekly" className="mt-6">
          <ChallengeGridContent 
            challenges={weeklyChallenges.filter(c => 
              c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            )}
            onStartChallenge={onStartChallenge}
            onCompleteChallenge={onCompleteChallenge}
            userLevel={userLevel}
            viewMode={viewMode}
          />
        </TabsContent>

        <TabsContent value="monthly" className="mt-6">
          <ChallengeGridContent 
            challenges={monthlyChallenges.filter(c => 
              c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            )}
            onStartChallenge={onStartChallenge}
            onCompleteChallenge={onCompleteChallenge}
            userLevel={userLevel}
            viewMode={viewMode}
          />
        </TabsContent>

        <TabsContent value="special" className="mt-6">
          <ChallengeGridContent 
            challenges={specialChallenges.filter(c => 
              c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            )}
            onStartChallenge={onStartChallenge}
            onCompleteChallenge={onCompleteChallenge}
            userLevel={userLevel}
            viewMode={viewMode}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ChallengeGridContentProps {
  challenges: Challenge[];
  onStartChallenge: (challengeId: string) => void;
  onCompleteChallenge: (challengeId: string) => void;
  userLevel: number;
  viewMode: 'grid' | 'list';
}

function ChallengeGridContent({ 
  challenges, 
  onStartChallenge, 
  onCompleteChallenge, 
  userLevel, 
  viewMode 
}: ChallengeGridContentProps) {
  if (challenges.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Filter className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges found</h3>
        <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className={
      viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-4'
    }>
      {challenges.map(challenge => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          onStart={onStartChallenge}
          onComplete={onCompleteChallenge}
          userLevel={userLevel}
        />
      ))}
    </div>
  );
}
