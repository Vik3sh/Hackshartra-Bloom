import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, MessageCircle, Users } from 'lucide-react';
import { useCommunity } from '@/contexts/CommunityContext';
import { realTimeMessagingService } from '@/services/realTimeMessaging';

interface UserDiscoveryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartChat: (userId: string, userData?: any) => void;
}

const UserDiscovery: React.FC<UserDiscoveryProps> = ({ open, onOpenChange, onStartChat }) => {
  const { currentUser } = useCommunity();
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load users from Supabase
  React.useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      console.log('Loading users from Supabase...');
      const users = await realTimeMessagingService.getUsers();
      console.log('Users loaded from Supabase:', users);
      console.log('Current user ID:', currentUser?.id);
      
      // Convert Supabase users to the expected format
      const convertedUsers = users.map(user => ({
        id: user.id,
        fullName: user.full_name || user.name || 'User',
        avatarUrl: user.avatar_url,
        bio: user.bio || '',
        postsCount: user.postsCount || user.posts_count || 0,
        followersCount: user.followersCount || user.followers_count || 0
      }));
      
      console.log('Converted users:', convertedUsers);
      const filteredUsers = convertedUsers.filter(user => {
        // Filter out current user and ensure user has valid data
        return user.id !== currentUser?.id && user.fullName && user.fullName !== 'User';
      });
      console.log('Filtered users (excluding current user):', filteredUsers);
      setAllUsers(filteredUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
      // Fallback: show some demo users if Firebase fails
      const demoUsers = [
        {
          id: 'demo-user-1',
          fullName: 'Vikesh Negi',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          bio: 'Environmental enthusiast and sustainability advocate',
          postsCount: 12,
          followersCount: 150
        },
        {
          id: 'demo-user-2',
          fullName: 'Eco Warrior',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          bio: 'Passionate about environmental conservation',
          postsCount: 25,
          followersCount: 200
        }
      ];
      console.log('Using demo users as fallback:', demoUsers);
      setAllUsers(demoUsers.filter(user => user.id !== currentUser?.id));
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = allUsers.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartChat = (userId: string) => {
    const userData = allUsers.find(user => user.id === userId);
    onStartChat(userId, userData);
    onOpenChange(false);
  };

  const addCurrentUser = async () => {
    if (!currentUser) return;
    
    try {
      await realTimeMessagingService.addUser(
        currentUser.id,
        currentUser.name,
        currentUser.avatarUrl,
        currentUser.bio || ''
      );
      console.log('Added current user to Supabase:', currentUser);
      
      // Reload users
      loadUsers();
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Discover Users
            </div>
            <Button
              onClick={addCurrentUser}
              size="sm"
              variant="outline"
              disabled={!currentUser}
            >
              Add Me to Chat
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Users List */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'No users found matching your search.' : 'No users available.'}
              </div>
            ) : (
              filteredUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatarUrl || undefined} />
                      <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold">{user.fullName}</div>
                      <div className="text-sm text-muted-foreground">{user.bio || 'No bio available'}</div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {user.postsCount} posts
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {user.followersCount} followers
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartChat(user.id)}
                      className="flex items-center gap-1"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      className="flex items-center gap-1"
                    >
                      <UserPlus className="h-4 w-4" />
                      Follow
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDiscovery;
