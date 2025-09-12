import React, { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Search, Plus, UserPlus, ChevronRight, Edit3, Save, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import PokemonAvatarPicker from '@/components/auth/PokemonAvatarPicker';

const StatPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl bg-white/90 shadow-sm px-6 py-4">
    <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    <div className="text-2xl font-semibold text-slate-900">{value}</div>
  </div>
);

const MiniBars: React.FC<{ values: number[] }> = ({ values }) => {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-2 h-20">
      {values.map((v, i) => (
        <div key={i} className="w-4 rounded-lg bg-indigo-200">
          <div className="w-full rounded-lg bg-indigo-600" style={{ height: `${(v / max) * 100}%` }} />
        </div>
      ))}
    </div>
  );
};

const MiniPost: React.FC<{ title: string; image?: string }> = ({ title, image }) => (
  <div className="rounded-2xl overflow-hidden shadow-sm bg-gradient-to-b from-slate-900 to-slate-800 text-white">
    <div
      className="h-24 bg-cover bg-center"
      style={{ backgroundImage: image ? `url(${image})` : 'linear-gradient(135deg,#4338CA,#6D28D9)' }}
    />
    <div className="px-3 py-2 text-sm opacity-90">{title}</div>
  </div>
);

const Profile: React.FC = () => {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const name = profile?.full_name || 'User';
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.full_name || '');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(profile?.pokemon_avatar || null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Handler functions
  const handleEditClick = () => {
    setIsEditing(true);
    setEditName(profile?.full_name || '');
    setSelectedAvatar(profile?.pokemon_avatar || null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName(profile?.full_name || '');
    setSelectedAvatar(profile?.pokemon_avatar || null);
    setShowAvatarPicker(false);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await updateProfile({
        full_name: editName.trim(),
        pokemon_avatar: selectedAvatar
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      setIsEditing(false);
      setShowAvatarPicker(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
  };

  const handleAvatarConfirm = () => {
    setShowAvatarPicker(false);
  };

  const handleAvatarSkip = () => {
    setSelectedAvatar(null);
    setShowAvatarPicker(false);
  };

  return (
    <div className="bg-gradient-to-br from-[#e8edff] via-[#eef1ff] to-[#f3eaff]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left main content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {isEditing ? (
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {selectedAvatar ? (
                        <img 
                          src={selectedAvatar} 
                          alt="Selected Pokemon Avatar" 
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 text-white flex items-center justify-center font-semibold">
                          {editName.charAt(0)}
                        </div>
                      )}
                      <button
                        onClick={() => setShowAvatarPicker(true)}
                        className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600 transition-colors"
                      >
                        ✏️
                      </button>
                    </div>
                    <div>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="text-sm text-slate-600 border-gray-300"
                        placeholder="Enter your name"
                      />
                      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">Edit Profile</h1>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {profile?.pokemon_avatar ? (
                      <img 
                        src={profile.pokemon_avatar} 
                        alt="Pokemon Avatar" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 text-white flex items-center justify-center font-semibold">
                        {name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-slate-600">Hi {name},</div>
                      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome back!</h1>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Edit/Save/Cancel buttons */}
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isUpdating}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isUpdating ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleEditClick}
                    variant="outline"
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            <div className="relative">
              <Input placeholder="Search for contacts..." className="h-12 rounded-full bg-white pr-14" />
              <button className="absolute right-1 top-1 h-10 w-10 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* Stats + chart */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-3xl bg-white/90">
                <CardContent className="p-6 space-y-3">
                  <StatPill label="Total views" value="72,593" />
                  <StatPill label="This week" value="9,307" />
                  <StatPill label="Today" value="1,328" />
                </CardContent>
              </Card>

              <Card className="md:col-span-2 rounded-3xl bg-white/90">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                    <span>Time spent</span>
                    <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-600 text-xs">37 min</span>
                  </div>
                  <div className="h-36 rounded-2xl bg-gradient-to-b from-indigo-50 to-white relative overflow-hidden">
                    <svg viewBox="0 0 100 40" className="absolute inset-0 w-full h-full">
                      <path d="M0 30 C 20 15, 40 35, 60 22 S 80 35, 100 18" fill="none" stroke="#6366f1" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Post composer */}
            <Card className="rounded-3xl bg-white/90">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {profile?.pokemon_avatar ? (
                    <img 
                      src={profile.pokemon_avatar} 
                      alt="Pokemon Avatar" 
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 text-white flex items-center justify-center text-sm font-semibold">
                      {name.charAt(0)}
                    </div>
                  )}
                  <Input placeholder="My latest trip was..." className="rounded-full" />
                  <Button className="rounded-full bg-indigo-500 hover:bg-indigo-600">Post now</Button>
                </div>
              </CardContent>
            </Card>

            {/* Bottom stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-3xl bg-white/90">
                <CardContent className="p-6">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Recorded</div>
                  <div className="text-3xl font-semibold">173 min</div>
                  <div className="mt-6 text-xs uppercase tracking-wide text-slate-500">Today</div>
                  <div className="text-lg font-semibold">12 min</div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl bg-white/90">
                <CardContent className="p-6">
                  <div className="text-sm mb-2">Goal progress</div>
                  <div className="flex items-center gap-6">
                    <div className="relative h-24 w-24">
                      <div
                        className="h-24 w-24 rounded-full"
                        style={{ background: 'conic-gradient(#f59e0b 0% 57.3%, #e5e7eb 57.3% 100%)' }}
                      />
                      <div className="absolute inset-2 rounded-full bg-white/90 flex items-center justify-center text-sm font-semibold">57.3%</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-slate-500 mb-1">Daily records</div>
                      <MiniBars values={[12, 18, 9, 14, 22, 11, 16]} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl bg-white/90">
                <CardContent className="p-6">
                  <div className="text-sm mb-3">Linked accounts</div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-full">Twitter</Button>
                    <Button variant="outline" className="rounded-full">Dribbble</Button>
                    <Button variant="outline" className="rounded-full">Behance</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Card className="rounded-3xl overflow-hidden bg-white/90">
              <CardContent className="p-0">
                <div className="relative">
                  <div
                    className="h-64 bg-cover bg-center"
                    style={{ backgroundImage: `url('/placeholder.svg')` }}
                  />
                  <div className="absolute -bottom-6 left-5 flex items-center gap-2">
                    {profile?.pokemon_avatar ? (
                      <img 
                        src={profile.pokemon_avatar} 
                        alt="Pokemon Avatar" 
                        className="h-14 w-14 rounded-full object-cover ring-4 ring-white shadow-lg" 
                      />
                    ) : (
                      <Avatar className="h-14 w-14 ring-4 ring-white">
                        <AvatarImage src={profile?.pokemon_avatar} alt={name} />
                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
                <div className="p-5 pt-8">
                  <div className="text-xs text-slate-500 mb-1">Popular this week</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{name}</div>
                      <div className="text-xs text-slate-500">230,647</div>
                    </div>
                    <Button className="rounded-full bg-indigo-500 hover:bg-indigo-600">Follow</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl bg-white/90">
              <CardContent className="p-4 space-y-3">
                {['Annie Batford', 'Nancy Smith', 'Jack Bravis'].map((n) => (
                  <div key={n} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                        {n.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{n}</div>
                        <div className="text-xs text-slate-500">New member</div>
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-full h-8 px-3 text-xs">
                      <UserPlus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div className="text-sm text-slate-700">Top accounts</div>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {["Mark", "Max", "Samantha", "Olivia", "Ryan"].map((n) => (
                  <div key={n} className="min-w-[120px] rounded-2xl bg-white/90 shadow-sm p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-semibold">
                      {n.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{n}</div>
                      <div className="text-[10px] uppercase tracking-wide text-slate-500">Creator</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-slate-700">Top posts</div>
              <div className="grid grid-cols-2 gap-3">
                <MiniPost title="Synergy" />
                <MiniPost title="Urban" />
                <MiniPost title="Gardens" />
                <MiniPost title="Travel" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pokemon Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-semibold">Choose Your Pokemon Avatar</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAvatarPicker(false)}
                className="rounded-full"
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <PokemonAvatarPicker
                selected={selectedAvatar}
                onSelect={handleAvatarSelect}
                onConfirm={handleAvatarConfirm}
                onSkip={handleAvatarSkip}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
