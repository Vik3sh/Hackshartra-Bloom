import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Leaf, 
  Trophy, 
  Target, 
  Zap, 
  BookOpen, 
  Users, 
  Newspaper,
  Monitor,
  Gift,
  Flame,
  Star
} from 'lucide-react';
import CustomEcoTree from '../tree/CustomEcoTree';
import ErrorBoundary from '../ErrorBoundary';

interface SimpleEnhancedDashboardProps {
  userProgress: any; // Replace 'any' with actual type
  onNavigate: (tab: string) => void;
}

const WeeklyActivityChart: React.FC = () => {
  const data = [24, 32, 28, 22, 48, 18, 26];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const max = Math.max(...data);
  
  return (
    <div className="relative group">
      {/* Chart Container */}
      <div className="relative h-32 w-full bg-gradient-to-b from-blue-50/40 via-blue-50/20 to-transparent rounded-xl overflow-hidden border border-blue-100/50">
        <div className="flex items-end justify-between h-full px-4 py-4 gap-1">
          {data.map((value, index) => {
            const height = (value / max) * 80; // Use 80% of container height for better visibility
            return (
              <div key={index} className="flex-1 flex flex-col items-center group/bar relative">
                {/* Bar */}
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-300 hover:from-blue-600 hover:to-blue-500 group-hover/bar:shadow-lg min-h-[4px]"
                  style={{ height: `${height}px` }}
                />
                
                {/* Value label on hover */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 z-10">
                  <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                    {value}h
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Day labels */}
      <div className="flex justify-between mt-3 px-4">
        {days.map((day, index) => (
          <div key={index} className="text-xs text-blue-600 font-semibold group-hover:text-blue-800 transition-colors duration-300">
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

const SimpleEnhancedDashboard: React.FC<SimpleEnhancedDashboardProps> = ({ userProgress, onNavigate }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      {/* Left and Center Columns Combined - All components except Community Posts */}
      <div className="lg:col-span-6 space-y-6">
        {/* Top Row - Activity and Daily Quest */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced Activity Section */}
          <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-br from-blue-50 via-white to-indigo-50 h-[350px]">
            <CardContent className="p-5 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-900">Weekly Activity</h3>
                    <p className="text-sm text-blue-600 font-medium">Your learning progress this week</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-blue-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    24.9
                  </div>
                  <div className="text-sm text-blue-600 font-semibold">Hours spent</div>
                </div>
              </div>
              <WeeklyActivityChart />
            </CardContent>
          </Card>

          {/* Daily Quest Section - Same height as Activity */}
          <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 h-[350px]">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-orange-900">Daily Quest</h3>
                    <p className="text-xs text-orange-600 font-medium">Complete today's challenge</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-orange-900 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    +50
                  </div>
                  <div className="text-xs text-orange-600 font-semibold">XP</div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="bg-white/70 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 text-sm">Plant a Tree</span>
                    <span className="text-orange-600 font-semibold text-xs">3/4 steps</span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-1.5">
                    <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-1000 ease-out" style={{ width: '75%' }} />
                  </div>
                </div>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm py-2">
                  Continue Quest
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Row - Learning Streak and Claim Rewards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Learning Streak Section */}
          <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-br from-red-50 to-orange-50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-200 rounded-xl flex items-center justify-center">
                    <Flame className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-900">Learning Streak</h3>
                    <p className="text-sm text-red-600 font-medium">Keep the momentum going!</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-red-900 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    7
                  </div>
                  <div className="text-sm text-red-600 font-semibold">Days</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-700">🔥 On fire!</span>
                <span className="text-red-600">Next milestone: 10 days</span>
              </div>
            </CardContent>
          </Card>

          {/* Claim Exp Points Section */}
          <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-emerald-900">Claim Rewards</h3>
                  <p className="text-xs text-emerald-600">Collect your XP</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-white/70 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-emerald-700">150</div>
                  <div className="text-xs text-emerald-600">Available XP</div>
                </div>
                <div className="bg-white/70 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-emerald-700">25</div>
                  <div className="text-xs text-emerald-600">Streak Days</div>
                </div>
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm py-2">
                Claim All Rewards
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row - Quick Actions and Progress Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions Section */}
          <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-blue-50 h-[250px]">
            <CardContent className="p-5 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-900">Quick Actions</h3>
                  <p className="text-sm text-indigo-600 font-medium">Start learning now</p>
                </div>
              </div>
              <div className="space-y-2 flex-1 flex flex-col justify-center">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-auto p-3 rounded-lg hover:bg-indigo-100 transition-all duration-300"
                  onClick={() => onNavigate('lessons')}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <div className="text-left">
                      <div className="font-medium text-indigo-900">Start Learning</div>
                      <div className="text-xs text-indigo-600">Begin a new lesson</div>
                    </div>
                  </div>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-auto p-3 rounded-lg hover:bg-green-100 transition-all duration-300"
                  onClick={() => onNavigate('challenges')}
                >
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium text-green-900">Take Challenge</div>
                      <div className="text-xs text-green-600">Complete real-world tasks</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Progress Statistics - Same height as Quick Actions */}
          <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 h-[250px]">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-green-900">Progress Statistics</h3>
                  <p className="text-xs text-green-600">Track your learning journey</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-2 rounded-full bg-green-200 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 transition-all duration-1000 ease-out" style={{ width: '64%' }} />
                </div>
                <div className="text-lg font-bold text-green-700">64%</div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 flex-1">
                <div className="text-center rounded-lg border-0 bg-white/80 shadow-sm p-2 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 mx-auto flex items-center justify-center mb-1 font-bold text-xs">8</div>
                  <div className="text-xs text-gray-600 font-medium">In Progress</div>
                </div>
                <div className="text-center rounded-lg border-0 bg-white/80 shadow-sm p-2 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center mb-1 font-bold text-xs">12</div>
                  <div className="text-xs text-gray-600 font-medium">Completed</div>
                </div>
                <div className="text-center rounded-lg border-0 bg-white/80 shadow-sm p-2 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-1 font-bold text-xs">2</div>
                  <div className="text-xs text-gray-600 font-medium">Late</div>
                </div>
                <div className="text-center rounded-lg border-0 bg-white/80 shadow-sm p-2 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 mx-auto flex items-center justify-center mb-1 font-bold text-xs">14</div>
                  <div className="text-xs text-gray-600 font-medium">Upcoming</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

                {/* Community Posts Section - Fills remaining space */}
                <div className="mt-4">
                  <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 h-[605px]">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-blue-900">Community Posts</h3>
                  <p className="text-xs text-blue-600">Latest from the community</p>
                </div>
              </div>
              
              <Tabs defaultValue="in-progress" className="w-full flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-4 h-8">
                  <TabsTrigger value="in-progress" className="text-xs px-2 py-1">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold mb-1">8</div>
                      <span className="text-xs">In Progress</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="text-xs px-2 py-1">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mb-1">12</div>
                      <span className="text-xs">Completed</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="late" className="text-xs px-2 py-1">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mb-1">2</div>
                      <span className="text-xs">Late</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="text-xs px-2 py-1">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xs font-bold mb-1">14</div>
                      <span className="text-xs">Upcoming</span>
                    </div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="in-progress" className="mt-4 flex-1">
                  <div className="space-y-3 h-full overflow-y-auto">
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-purple-600">A</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">Alex Chen</span>
                        <span className="text-xs text-gray-500">2h ago</span>
                      </div>
                      <p className="text-sm text-gray-700">Just started the Climate Change module. Really excited to learn more about renewable energy!</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button className="text-xs text-gray-500 hover:text-blue-600">Like (3)</button>
                        <button className="text-xs text-gray-500 hover:text-green-600">Comment (1)</button>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-green-600">M</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">Maria Rodriguez</span>
                        <span className="text-xs text-gray-500">4h ago</span>
                      </div>
                      <p className="text-sm text-gray-700">Working on the waste reduction challenge. Any tips for reducing plastic usage?</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button className="text-xs text-gray-500 hover:text-blue-600">Like (7)</button>
                        <button className="text-xs text-gray-500 hover:text-green-600">Comment (4)</button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="completed" className="mt-4 flex-1">
                  <div className="space-y-3 h-full overflow-y-auto">
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-green-600">J</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">John Smith</span>
                        <span className="text-xs text-gray-500">1d ago</span>
                      </div>
                      <p className="text-sm text-gray-700">Completed the Ocean Conservation course! Learned so much about marine ecosystems.</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button className="text-xs text-gray-500 hover:text-blue-600">Like (12)</button>
                        <button className="text-xs text-gray-500 hover:text-green-600">Comment (6)</button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="late" className="mt-4 flex-1">
                  <div className="space-y-3 h-full overflow-y-auto">
                    <div className="text-center text-sm text-gray-600 py-4">
                      <p>No overdue activities</p>
                      <p className="text-xs">Great job staying on track!</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="upcoming" className="mt-4 flex-1">
                  <div className="space-y-3 h-full overflow-y-auto">
                    <div className="text-center text-sm text-gray-600 py-4">
                      <p>No upcoming activities</p>
                      <p className="text-xs">New content will appear here</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Column - Eco Tree (40%) */}
      <div className="h-full lg:col-span-4">
        {/* Eco Tree - Takes full space */}
        <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 h-full min-h-[900px]">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-900">Your Eco Tree</h3>
                <p className="text-sm text-green-600 font-medium">Grows with your environmental actions</p>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <ErrorBoundary>
                <CustomEcoTree />
              </ErrorBoundary>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleEnhancedDashboard;