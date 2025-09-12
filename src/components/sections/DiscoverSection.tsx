import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf, Settings, Gamepad2, Trophy, Target } from 'lucide-react';

interface DiscoverSectionProps {
  isDarkMode: boolean;
  userPreferences: {
    interests: string[];
    skillLevel: string;
    preferredCategories: string[];
  };
  onPreferencesChange?: (preferences: any) => void;
}

const DiscoverSection: React.FC<DiscoverSectionProps> = ({ isDarkMode, userPreferences, onPreferencesChange }) => {
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [tempPreferences, setTempPreferences] = useState(userPreferences);

  const handleSavePreferences = () => {
    if (onPreferencesChange) {
      onPreferencesChange(tempPreferences);
    }
    setIsCustomizeOpen(false);
  };

  const handleInterestToggle = (interest: string) => {
    setTempPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  // Environmental education categories
  const environmentalCategories = [
    "Climate Change & Global Warming",
    "Waste Management & Recycling", 
    "Water Conservation & Sanitation",
    "Air Pollution & Energy Conservation",
    "Biodiversity & Ecosystems",
    "Sustainable Agriculture & Food Systems",
    "Renewable Energy Sources"
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            Environmental Learning Topics
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
            Choose your environmental interests for personalized learning
          </p>
        </div>

        <Dialog open={isCustomizeOpen} onOpenChange={setIsCustomizeOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center space-x-1 text-xs px-3 py-1.5">
              <Settings className="h-3 w-3" />
              <span>Customize</span>
            </Button>
          </DialogTrigger>
          <DialogContent className={`max-w-md ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? 'text-white' : 'text-slate-800'}>
                Customize Your Environmental Interests
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Environmental Categories */}
              <div className="space-y-3">
                <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>
                  Environmental Topics
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {environmentalCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={tempPreferences.interests.includes(category)}
                        onCheckedChange={() => handleInterestToggle(category)}
                      />
                      <Label
                        htmlFor={category}
                        className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Level */}
              <div className="space-y-3">
                <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>
                  Learning Level
                </Label>
                <Select
                  value={tempPreferences.skillLevel}
                  onValueChange={(value) => setTempPreferences(prev => ({ ...prev, skillLevel: value }))}
                >
                  <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCustomizeOpen(false)}
                  className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
                >
                  Cancel
                </Button>
                <Button onClick={handleSavePreferences} className="bg-green-600 hover:bg-green-700">
                  Save Preferences
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Environmental Learning Games */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-blue-900">
                Interactive Learning Games
              </h4>
            </div>

            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <p className="text-blue-700 font-medium">Environmental games and quizzes will appear here</p>
              <p className="text-sm text-blue-600 mt-2">Choose your interests to get personalized content</p>
            </div>
          </CardContent>
        </Card>

        {/* Eco-Challenges */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:border-green-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-green-900">
                Eco-Challenges & Missions
              </h4>
            </div>

            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <p className="text-green-700 font-medium">Environmental challenges and missions will appear here</p>
              <p className="text-sm text-green-600 mt-2">Complete challenges to earn badges and points</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiscoverSection;

