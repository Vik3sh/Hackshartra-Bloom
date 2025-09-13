import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import PokemonAvatarPicker from './PokemonAvatarPicker';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [signUpData, setSignUpData] = useState<{email: string, password: string, fullName: string, pokemonAvatar?: string} | null>(null);
  
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Signed in successfully!',
      });
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store sign-up data and show avatar picker
    setSignUpData({ email, password, fullName });
    setShowAvatarPicker(true);
  };

  const handleAvatarConfirm = async () => {
    if (!signUpData) return;
    
    setLoading(true);

    const { error } = await signUp(signUpData.email, signUpData.password, { 
      fullName: signUpData.fullName, 
      pokemonAvatar: selectedAvatar 
    });
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Account created successfully! Please check your email to verify your account.',
      });
    }
    
    setLoading(false);
    setShowAvatarPicker(false);
    setSignUpData(null);
    setSelectedAvatar(null);
  };

  const handleAvatarSkip = async () => {
    if (!signUpData) return;
    
    setLoading(true);

    const { error } = await signUp(signUpData.email, signUpData.password, { 
      fullName: signUpData.fullName 
    });
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Account created successfully! Please check your email to verify your account.',
      });
    }
    
    setLoading(false);
    setShowAvatarPicker(false);
    setSignUpData(null);
    setSelectedAvatar(null);
  };

  if (showAvatarPicker) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <Card className="w-full max-w-4xl shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌱</span>
            </div>
            <CardTitle className="text-2xl font-bold text-blue-900">Choose Your Avatar</CardTitle>
            <CardDescription className="text-blue-600">
              Select a Pokémon avatar to represent you in the bloom
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <PokemonAvatarPicker
              selected={selectedAvatar}
              onSelect={setSelectedAvatar}
              onConfirm={handleAvatarConfirm}
              onSkip={handleAvatarSkip}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-2xl">🌱</span>
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900">Bloom</CardTitle>
          <CardDescription className="text-blue-600">
            Learn about our planet through interactive games and challenges
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-blue-50 mb-6">
              <TabsTrigger value="signin" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;