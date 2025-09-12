import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  userProgress: any;
  onNavigate: (tab: string) => void;
}

const ActivityBars: React.FC = () => {
  const data = [24, 32, 28, 22, 48, 18, 26];
  const max = Math.max(...data);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <div>
      <div className="flex items-end justify-between gap-3 h-40">
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className="relative w-full">
              <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-1000 ease-out hover:from-blue-600 hover:to-blue-500" style={{ height: `${(v / max) * 100}%` }} />
            </div>
            <div className="text-xs text-gray-600 mt-2 font-medium">{days[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SimpleEnhancedDashboard: React.FC<SimpleEnhancedDashboardProps> = ({ userProgress, onNavigate }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Enhanced components */}
      <div className="lg:col-span-2 space-y-6">
        {/* Enhanced Activity Section */}
        <Card className="rounded-3xl border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Weekly Activity</h3>
                  <p className="text-sm text-blue-600">Your learning progress this week</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-900">24.9</div>
                <div className="text-sm text-blue-600">Hours spent</div>
              </div>
            </div>
            <ActivityBars />
          </CardContent>
        </Card>

        {/* Enhanced Progress Statistics */}
        <Card className="rounded-3xl border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900">Progress Statistics</h3>
                <p className="text-sm text-green-600">Track your environmental learning journey</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-3 rounded-full bg-green-200 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 transition-all duration-1000 ease-out" style={{ width: '64%' }} />
              </div>
              <div className="text-3xl font-bold text-green-700">64%</div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center rounded-2xl border-0 bg-white/80 shadow-md p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 mx-auto flex items-center justify-center mb-2 font-bold">8</div>
                <div className="text-xs text-gray-600 font-medium">In Progress</div>
              </div>
              <div className="text-center rounded-2xl border-0 bg-white/80 shadow-md p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center mb-2 font-bold">12</div>
                <div className="text-xs text-gray-600 font-medium">Completed</div>
              </div>
              <div className="text-center rounded-2xl border-0 bg-white/80 shadow-md p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-2 font-bold">2</div>
                <div className="text-xs text-gray-600 font-medium">Late</div>
              </div>
              <div className="text-center rounded-2xl border-0 bg-white/80 shadow-md p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 mx-auto flex items-center justify-center mb-2 font-bold">14</div>
                <div className="text-xs text-gray-600 font-medium">Upcoming</div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Enhanced Daily Reward */}
        <Card className="rounded-3xl border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-900">Daily Reward</h3>
                <p className="text-sm text-purple-600 mb-3">Claim your daily bonus and boost your progress</p>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Claim 50 pts
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Learning Streak */}
        <Card className="rounded-3xl border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-900">Learning Streak</h3>
                <p className="text-sm text-orange-600 mb-2">Keep the momentum going!</p>
                <div className="text-3xl font-bold text-orange-700">7 days</div>
                <div className="text-xs text-orange-600 mt-1">🔥 On fire!</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Enhanced Cards for Left Side */}
        <Card className="rounded-3xl border-0 shadow-xl bg-gradient-to-br from-cyan-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-cyan-900">Achievements</h3>
                <p className="text-sm text-cyan-600">Track your progress milestones</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-xl bg-white/80">
                <div className="text-2xl font-bold text-cyan-700">5</div>
                <div className="text-xs text-cyan-600">Badges Earned</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/80">
                <div className="text-2xl font-bold text-cyan-700">12</div>
                <div className="text-xs text-cyan-600">Quizzes Passed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-xl bg-gradient-to-br from-pink-50 to-rose-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-pink-900">Community</h3>
                <p className="text-sm text-pink-600">Connect with other learners</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-600 text-sm font-bold">A</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Aman Singh</div>
                  <div className="text-xs text-gray-600">Completed Tree Planting Challenge</div>
                </div>
                <div className="text-xs text-pink-600">2h ago</div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-600 text-sm font-bold">P</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Priya Sharma</div>
                  <div className="text-xs text-gray-600">Shared eco-friendly tips</div>
                </div>
                <div className="text-xs text-pink-600">4h ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Eco Tree and enhanced components */}
      <div className="space-y-6">
        {/* Eco Tree - Keep in original right position */}
        <Card className="rounded-3xl border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 md:min-h-[360px]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900">Your Eco Tree</h3>
                <p className="text-sm text-green-600">Grows with your environmental actions</p>
              </div>
            </div>
            <div className="mt-5">
              <ErrorBoundary>
                <CustomEcoTree />
              </ErrorBoundary>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="rounded-3xl border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-indigo-900">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto p-4 rounded-xl hover:bg-indigo-100 transition-all duration-300"
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
                className="w-full justify-start h-auto p-4 rounded-xl hover:bg-green-100 transition-all duration-300"
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
              
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto p-4 rounded-xl hover:bg-purple-100 transition-all duration-300"
                onClick={() => onNavigate('news')}
              >
                <div className="flex items-center gap-3">
                  <Newspaper className="w-5 h-5 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium text-purple-900">Read News</div>
                    <div className="text-xs text-purple-600">Latest environmental news</div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Preview */}
        <Card className="rounded-3xl border-0 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-yellow-900">Recent Achievements</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80 shadow-sm">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">First Steps</div>
                  <div className="text-xs text-gray-600">Complete your first lesson</div>
                </div>
                <div className="text-xs text-green-600 font-medium">✓</div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80 shadow-sm">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Tree Planter</div>
                  <div className="text-xs text-gray-600">Grow your first tree</div>
                </div>
                <div className="text-xs text-gray-400">75%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Goal */}
        <Card className="rounded-3xl border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-900">Daily Goal</h3>
                <p className="text-emerald-600 text-sm">Complete 3 activities today</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-700">Progress</span>
                  <span className="text-emerald-700 font-semibold">2/3</span>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: '67%' }} />
                </div>
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleEnhancedDashboard;
