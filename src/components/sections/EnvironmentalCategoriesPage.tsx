// Environmental Categories Page - Second page with seven environmental option palettes
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  Recycle, 
  Droplets, 
  Wind, 
  Trees, 
  Wheat, 
  Sun,
  ChevronDown,
  Play,
  BookOpen,
  Target
} from 'lucide-react';

interface EnvironmentalCategoriesPageProps {
  isDarkMode: boolean;
  userPreferences: {
    interests: string[];
    skillLevel: string;
    preferredCategories: string[];
  };
  onPreferencesChange?: (preferences: any) => void;
}

const EnvironmentalCategoriesPage: React.FC<EnvironmentalCategoriesPageProps> = ({ 
  isDarkMode, 
  userPreferences, 
  onPreferencesChange 
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(userPreferences.interests);

  const environmentalCategories = [
    {
      id: 'climate-change',
      title: 'Climate Change & Global Warming',
      description: 'Learn about greenhouse gases, carbon footprint, and climate solutions',
      icon: Cloud,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900',
      accentColor: 'text-blue-600',
      topics: ['Greenhouse Gases', 'Carbon Footprint', 'Renewable Energy', 'Climate Solutions']
    },
    {
      id: 'waste-management',
      title: 'Waste Management & Recycling',
      description: 'Master the 3Rs: Reduce, Reuse, Recycle for a sustainable future',
      icon: Recycle,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      accentColor: 'text-green-600',
      topics: ['Zero Waste', 'Composting', 'Plastic Alternatives', 'Circular Economy']
    },
    {
      id: 'water-conservation',
      title: 'Water Conservation & Sanitation',
      description: 'Protect our most precious resource through smart water management',
      icon: Droplets,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'from-cyan-50 to-cyan-100',
      borderColor: 'border-cyan-200',
      textColor: 'text-cyan-900',
      accentColor: 'text-cyan-600',
      topics: ['Water Scarcity', 'Rainwater Harvesting', 'Water Treatment', 'Sanitation']
    },
    {
      id: 'air-pollution',
      title: 'Air Pollution & Energy Conservation',
      description: 'Breathe cleaner air and conserve energy for a healthier planet',
      icon: Wind,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-900',
      accentColor: 'text-purple-600',
      topics: ['Air Quality', 'Energy Efficiency', 'Clean Transportation', 'Indoor Air']
    },
    {
      id: 'biodiversity',
      title: 'Biodiversity & Ecosystems',
      description: 'Protect wildlife and preserve natural ecosystems for future generations',
      icon: Trees,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-900',
      accentColor: 'text-emerald-600',
      topics: ['Wildlife Conservation', 'Ecosystem Services', 'Habitat Protection', 'Species Diversity']
    },
    {
      id: 'sustainable-agriculture',
      title: 'Sustainable Agriculture & Food Systems',
      description: 'Grow food sustainably and understand our food system impact',
      icon: Wheat,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'from-amber-50 to-amber-100',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-900',
      accentColor: 'text-amber-600',
      topics: ['Organic Farming', 'Food Security', 'Local Food', 'Sustainable Diets']
    },
    {
      id: 'renewable-energy',
      title: 'Renewable Energy Sources',
      description: 'Harness clean energy from sun, wind, and water for a sustainable future',
      icon: Sun,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-900',
      accentColor: 'text-orange-600',
      topics: ['Solar Power', 'Wind Energy', 'Hydroelectric', 'Energy Storage']
    }
  ];

  const handleCategoryToggle = (categoryId: string) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelection);
    
    if (onPreferencesChange) {
      onPreferencesChange({
        ...userPreferences,
        interests: newSelection
      });
    }
  };

  const scrollToHero = () => {
    document.getElementById('hero-page')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Environmental Learning Topics
        </h2>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Choose your areas of interest to personalize your learning experience
        </p>
        <div className="mt-4">
          <Button
            onClick={scrollToHero}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            <ChevronDown className="h-4 w-4 mr-2" />
            Back to Hero
          </Button>
        </div>
      </div>

      {/* Environmental Categories Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
        {environmentalCategories.map((category) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategories.includes(category.id);
          
          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                isSelected 
                  ? `bg-gradient-to-br ${category.bgColor} ${category.borderColor} border-2 shadow-lg` 
                  : `bg-white/80 backdrop-blur-sm border-gray-200 hover:border-gray-300`
              }`}
              onClick={() => handleCategoryToggle(category.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <CardTitle className={`text-lg font-semibold ${isSelected ? category.textColor : isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {category.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center space-y-4">
                <p className={`text-sm ${isSelected ? category.accentColor : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {category.description}
                </p>
                
                {/* Topics */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {category.topics.map((topic, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className={`text-xs ${isSelected ? 'bg-white/80 text-gray-700' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-center pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className={`text-xs ${isSelected ? category.accentColor : 'text-gray-600'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Navigate to category content
                    }}
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    Learn
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`text-xs ${isSelected ? category.accentColor : 'text-gray-600'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Start quiz/game
                    }}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Play
                  </Button>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="flex items-center justify-center text-sm font-medium text-green-600">
                    <Target className="h-4 w-4 mr-1" />
                    Selected
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {selectedCategories.length > 0 
            ? `You've selected ${selectedCategories.length} environmental topic${selectedCategories.length > 1 ? 's' : ''}`
            : 'Select topics to start your environmental learning journey'
          }
        </p>
      </div>
    </div>
  );
};

export default EnvironmentalCategoriesPage;
