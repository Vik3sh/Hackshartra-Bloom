import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Calendar, Star, Clock, Settings } from 'lucide-react';

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
  // Mock data based on user preferences
  const recommendedCourses = [
    {
      id: 1,
      title: "Advanced React Development",
      instructor: "Dr. Sarah Johnson",
      duration: "8 weeks",
      rating: 4.8,
      students: 1247,
      category: "programming",
      level: "intermediate"
    },
    {
      id: 2,
      title: "Machine Learning Fundamentals",
      instructor: "Prof. Michael Chen",
      duration: "12 weeks",
      rating: 4.9,
      students: 892,
      category: "data-science",
      level: "beginner"
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      instructor: "Lisa Rodriguez",
      duration: "6 weeks",
      rating: 4.7,
      students: 654,
      category: "design",
      level: "intermediate"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      date: "March 15, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Main Auditorium",
      type: "conference"
    },
    {
      id: 2,
      title: "Hackathon: Sustainable Solutions",
      date: "March 22, 2024",
      time: "10:00 AM - 6:00 PM",
      location: "Computer Lab 2",
      type: "competition"
    },
    {
      id: 3,
      title: "Career Fair 2024",
      date: "March 28, 2024",
      time: "11:00 AM - 4:00 PM",
      location: "Sports Complex",
      type: "career"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            Discover
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
            Personalized recommendations based on your interests
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
                Customize Your Preferences
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Interests */}
              <div className="space-y-3">
                <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>
                  Interests
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {['programming', 'data-science', 'design', 'business', 'academic', 'sports', 'arts', 'music'].map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={tempPreferences.interests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <Label
                        htmlFor={interest}
                        className={`text-sm capitalize ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}
                      >
                        {interest.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Level */}
              <div className="space-y-3">
                <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>
                  Skill Level
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

              {/* Categories */}
              <div className="space-y-3">
                <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>
                  Preferred Categories
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {['technology', 'academic', 'professional', 'creative', 'health', 'lifestyle'].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={tempPreferences.preferredCategories.includes(category)}
                        onCheckedChange={() => {
                          setTempPreferences(prev => ({
                            ...prev,
                            preferredCategories: prev.preferredCategories.includes(category)
                              ? prev.preferredCategories.filter(c => c !== category)
                              : [...prev.preferredCategories, category]
                          }));
                        }}
                      />
                      <Label
                        htmlFor={category}
                        className={`text-sm capitalize ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
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
                <Button onClick={handleSavePreferences} className="bg-blue-600 hover:bg-blue-700">
                  Save Preferences
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recommended Courses */}
        <Card className={`shadow-lg hover:shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <h4 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                Recommended Courses
              </h4>
            </div>
            
            <div className="space-y-3">
              {recommendedCourses.map((course) => (
                <div key={course.id} className={`p-3 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50/50 border-gray-200'
                } hover:shadow-md transition-all duration-200`}>
                  <div className="flex items-start justify-between mb-2">
                    <h5 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      {course.title}
                    </h5>
                    <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5">
                      {course.level}
                    </Badge>
                  </div>
                  <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                    by {course.instructor}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{course.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{course.rating}</span>
                    </span>
                    <span className="text-xs">{course.students}</span>
                  </div>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-xs py-1.5">
                    Enroll Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className={`shadow-lg hover:shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="h-4 w-4 text-green-600" />
              <h4 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                Upcoming Events
              </h4>
            </div>
            
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className={`p-3 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50/50 border-gray-200'
                } hover:shadow-md transition-all duration-200`}>
                  <div className="flex items-start justify-between mb-2">
                    <h5 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      {event.title}
                    </h5>
                    <Badge className={`text-xs px-2 py-0.5 ${
                      event.type === 'conference' ? 'bg-purple-100 text-purple-700' :
                      event.type === 'competition' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {event.type}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                      <Calendar className="h-3 w-3" />
                      <span>{event.date}</span>
                    </p>
                    <p className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                      <Clock className="h-3 w-3" />
                      <span>{event.time}</span>
                    </p>
                    <p className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                      <span>📍</span>
                      <span>{event.location}</span>
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-2 text-xs py-1.5">
                    Register
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiscoverSection;

