// Demo mode component when Firebase is not configured
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, Settings } from 'lucide-react';

const DemoMode: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🌱</span>
          </div>
          <CardTitle className="text-3xl font-bold text-blue-900">Environmental Education Platform</CardTitle>
          <p className="text-blue-600 text-lg">Demo Mode - Firebase Not Configured</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert className="bg-yellow-50 border-yellow-200">
            <Settings className="h-4 w-4" />
            <AlertDescription className="text-yellow-800">
              <strong>Demo Mode:</strong> Firebase credentials are not configured. This is a preview of the interface.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">🎮 Interactive Learning</h3>
                <p className="text-blue-700 text-sm">
                  Environmental games, quizzes, and simulations to make learning fun and engaging.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">🏆 Gamification</h3>
                <p className="text-green-700 text-sm">
                  Badges, leaderboards, and challenges to motivate students and track progress.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">📚 Curriculum Integration</h3>
                <p className="text-yellow-700 text-sm">
                  Aligned with educational standards and SDG goals for comprehensive learning.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">🌍 Localized Content</h3>
                <p className="text-purple-700 text-sm">
                  Regional environmental issues and Punjab-specific content for relevant learning.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">🚀 To Get Started:</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-700 text-sm">
              <li>Set up your Firebase project and get credentials</li>
              <li>Set up your Supabase project for authentication</li>
              <li>Update <code className="bg-blue-200 px-2 py-1 rounded">.env.local</code> with your credentials</li>
              <li>Update <code className="bg-blue-200 px-2 py-1 rounded">backend/.env</code> with your backend credentials</li>
              <li>Restart the development server</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.open('https://firebase.google.com/', '_blank')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Setup Firebase
            </Button>
            <Button 
              onClick={() => window.open('https://supabase.com/', '_blank')}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Setup Supabase
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoMode;
