import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, User, Database, Key } from 'lucide-react';

const ProfileDebugger: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [authUser, setAuthUser] = useState<any>(null);
  const [userMetadata, setUserMetadata] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAuthUser = async () => {
    setIsLoading(true);
    try {
      const { data: { user: authUserData }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching auth user:', error);
      } else {
        setAuthUser(authUserData);
        setUserMetadata(authUserData?.user_metadata || {});
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthUser();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Supabase Profile Debugger</h2>
        <Button onClick={fetchAuthUser} disabled={isLoading} className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Authentication Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-2">
              <Badge variant="default" className="bg-green-500">Authenticated</Badge>
              <p className="text-sm text-gray-600">User ID: {user.id}</p>
              <p className="text-sm text-gray-600">Email: {user.email}</p>
              <p className="text-sm text-gray-600">Last Sign In: {formatDate(user.last_sign_in_at || '')}</p>
            </div>
          ) : (
            <Badge variant="destructive">Not Authenticated</Badge>
          )}
        </CardContent>
      </Card>

      {/* Auth User Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Raw Auth User Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          {authUser ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">User Object:</h4>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(authUser, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">User Metadata:</h4>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(userMetadata, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No auth user data available</p>
          )}
        </CardContent>
      </Card>

      {/* Profile Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Profile Data (from profiles table)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profileLoading ? (
            <p className="text-gray-500">Loading profile...</p>
          ) : profile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-700">Profile ID:</h4>
                  <p className="text-sm text-gray-600">{profile.id}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700">User ID:</h4>
                  <p className="text-sm text-gray-600">{profile.user_id}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700">Full Name:</h4>
                  <p className="text-sm text-gray-600">{profile.full_name}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700">Email:</h4>
                  <p className="text-sm text-gray-600">{profile.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700">Role:</h4>
                  <Badge variant="outline">{profile.role}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700">Pokemon Avatar:</h4>
                  <p className="text-sm text-gray-600">{profile.pokemon_avatar || 'None'}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Full Profile Object:</h4>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(profile, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No profile data available</p>
          )}
        </CardContent>
      </Card>

      {/* Pokemon Avatar Preview */}
      {profile?.pokemon_avatar && (
        <Card>
          <CardHeader>
            <CardTitle>Pokemon Avatar Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <img 
                src={profile.pokemon_avatar} 
                alt="Pokemon Avatar" 
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
              />
              <div>
                <p className="text-sm text-gray-600">URL: {profile.pokemon_avatar}</p>
                <p className="text-xs text-gray-500">Click to open in new tab</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileDebugger;
