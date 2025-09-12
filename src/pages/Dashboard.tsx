// EcoLearn Dashboard - Copy of reference design with typing.com color theme
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Leaf, 
  Trash2, 
  Zap, 
  AlertTriangle, 
  Gift, 
  Flame, 
  Trophy,
  Target,
  BookOpen,
  Users,
  Newspaper
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('lessons');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-blue-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              EcoLearn
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              Progress
            </Button>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              Achievements
            </Button>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              Community
            </Button>
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">K</span>
            </div>
            <span className="text-blue-900 font-medium">karan962532</span>
            <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-4 bg-white border border-blue-200">
            <TabsTrigger value="lessons" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm">
              Lessons
            </TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm">
              Challenges
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm">
              Community
            </TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm">
              News
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - User Progress */}
              <div className="space-y-6">
                {/* Your Progress Card */}
                <Card className="bg-white border-blue-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Your Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">150</div>
                      <div className="text-blue-500">Total Points</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700">Level 3</span>
                        <span className="text-blue-600">Level 4</span>
                      </div>
                      <Progress value={50} className="h-2" />
                      <div className="text-center text-sm text-blue-600">50/100 points to next level</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Your Badges Card */}
                <Card className="bg-white border-blue-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Your Badges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                        <Trophy className="w-3 h-3 mr-1" />
                        Eco Warrior
                      </Badge>
                      <Badge className="bg-purple-500 text-white hover:bg-purple-600">
                        <Target className="w-3 h-3 mr-1" />
                        Quiz Master
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Your Eco Tree Card */}
                <Card className="bg-white border-blue-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Your Eco Tree</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-sm text-blue-600 mb-4">Grows with your environmental actions.</div>
                      <div className="w-16 h-16 mx-auto bg-gradient-to-b from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <Leaf className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Middle Column - Lesson Categories */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Environmental Topics</h2>
                
                {/* Climate Science Card */}
                <Card className="bg-white border-blue-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Climate Science</h3>
                        <p className="text-blue-600 text-sm mb-3">Learn about climate change and its effects.</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-700">Progress</span>
                            <span className="text-blue-600">75%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Waste Management Card */}
                <Card className="bg-white border-blue-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Trash2 className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Waste Management</h3>
                        <p className="text-blue-600 text-sm mb-3">Reduce, reuse, recycle for a better planet.</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-700">Progress</span>
                            <span className="text-blue-600">45%</span>
                          </div>
                          <Progress value={45} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Renewable Energy Card */}
                <Card className="bg-white border-blue-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Renewable Energy</h3>
                        <p className="text-blue-600 text-sm mb-3">Explore solar, wind, and other clean energy.</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-700">Progress</span>
                            <span className="text-blue-600">20%</span>
                          </div>
                          <Progress value={20} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Disaster Preparedness Card */}
                <Card className="bg-white border-blue-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Disaster Preparedness</h3>
                        <p className="text-blue-600 text-sm mb-3">Learn how to prepare for natural disasters.</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-700">Progress</span>
                            <span className="text-blue-600">0%</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Rewards and Progress */}
              <div className="space-y-6">
                {/* Daily Reward Card */}
                <Card className="bg-white border-blue-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Gift className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-blue-900 mb-1">Daily Reward</h3>
                        <p className="text-blue-600 text-sm mb-3">Claim your daily bonus.</p>
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                          Claim 50 pts
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Streak Card */}
                <Card className="bg-white border-blue-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Flame className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-blue-900 mb-1">Learning Streak</h3>
                        <p className="text-blue-600 text-sm mb-2">7 days in a row.</p>
                        <div className="text-2xl font-bold text-orange-600 mb-1">7 days</div>
                        <p className="text-blue-600 text-xs">7 more days to weekly bonus.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Subject Progress Card */}
                <Card className="bg-white border-blue-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Subject Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-blue-700">Climate Science</span>
                          <span className="text-blue-600">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-blue-700">Waste Management</span>
                          <span className="text-blue-600">60%</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-blue-700">Renewable Energy</span>
                          <span className="text-blue-600">40%</span>
                        </div>
                        <Progress value={40} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="mt-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Challenges Coming Soon</h3>
              <p className="text-blue-600">Environmental challenges and competitions will be available here.</p>
            </div>
          </TabsContent>

          <TabsContent value="community" className="mt-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Community Coming Soon</h3>
              <p className="text-blue-600">Connect with other environmental learners and share your progress.</p>
            </div>
          </TabsContent>

          <TabsContent value="news" className="mt-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">News Coming Soon</h3>
              <p className="text-blue-600">Stay updated with the latest environmental news and updates.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
