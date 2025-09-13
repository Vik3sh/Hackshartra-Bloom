import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { firebaseMessagingService } from '../services/firebaseMessaging';
import { UserPlus, CheckCircle } from 'lucide-react';

const AddUsersToFirebase: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [user1, setUser1] = useState({
    id: 'user1',
    fullName: 'Vikesh Negi',
    email: 'negivikesh2@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    bio: 'Environmental enthusiast and sustainability advocate'
  });
  const [user2, setUser2] = useState({
    id: 'user2',
    fullName: 'Eco Warrior',
    email: 'ecowarrior@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    bio: 'Passionate about environmental conservation'
  });

  const addUsersToFirebase = async () => {
    setLoading(true);
    setStatus('Adding users to Firebase...');
    
    try {
      console.log('Adding user 1:', user1);
      // Add User 1
      const result1 = await firebaseMessagingService.getOrCreateUserProfile(user1.id, user1);
      console.log('User 1 result:', result1);
      setStatus('✅ Added User 1: ' + user1.fullName);
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Adding user 2:', user2);
      // Add User 2
      const result2 = await firebaseMessagingService.getOrCreateUserProfile(user2.id, user2);
      console.log('User 2 result:', result2);
      setStatus('✅ Added both users successfully! You can now discover and chat with them.');
      
    } catch (error) {
      console.error('Error adding users:', error);
      setStatus('❌ Error adding users: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const checkFirebaseUsers = async () => {
    try {
      console.log('Checking Firebase users...');
      const users = await firebaseMessagingService.getUsers();
      console.log('Current users in Firebase:', users);
      setStatus(`Found ${users.length} users in Firebase: ${users.map(u => u.fullName || u.name).join(', ')}`);
    } catch (error) {
      console.error('Error checking users:', error);
      setStatus('❌ Error checking users: ' + error);
    }
  };

  const clearFirebaseUsers = async () => {
    setLoading(true);
    setStatus('Clearing all users from Firebase...');
    
    try {
      // This is a simple approach - in production you'd want proper user management
      console.log('Note: To clear users, you need to delete them from Firebase Console');
      setStatus('⚠️ To clear users: Go to Firebase Console → Firestore → Delete users collection');
    } catch (error) {
      console.error('Error clearing users:', error);
      setStatus('❌ Error clearing users: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add Users to Firebase
        </CardTitle>
        <CardDescription>
          Add your two users to Firebase so they can discover and chat with each other.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>User 1</Label>
            <Input
              value={user1.fullName}
              onChange={(e) => setUser1({...user1, fullName: e.target.value})}
              placeholder="Full Name"
            />
          </div>
          
          <div className="space-y-2">
            <Label>User 2</Label>
            <Input
              value={user2.fullName}
              onChange={(e) => setUser2({...user2, fullName: e.target.value})}
              placeholder="Full Name"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={addUsersToFirebase} 
            disabled={loading}
            className="w-full"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Users to Firebase
          </Button>
          
          <Button 
            onClick={checkFirebaseUsers} 
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Check Firebase Users
          </Button>
          
          <Button 
            onClick={clearFirebaseUsers} 
            disabled={loading}
            className="w-full"
            variant="destructive"
          >
            🗑️ Clear Test Users
          </Button>
        </div>
        
        {status && (
          <div className="p-3 bg-slate-100 rounded-md text-sm">
            {status}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          💡 After adding users, go to Messages → Discover Users to find them!
        </div>
      </CardContent>
    </Card>
  );
};

export default AddUsersToFirebase;
