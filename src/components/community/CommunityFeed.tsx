import React, { useMemo, useState } from 'react';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import StoriesBar from './StoriesBar';
import CommunityRightSidebar from './CommunityRightSidebar';
import StoryViewer from './StoryViewer';
import MessagesModal from './MessagesModal';
import AddUsersToFirebase from '../AddUsersToFirebase';
import { useCommunity } from '@/contexts/CommunityContext';

const CommunityFeed: React.FC = () => {
  const { posts } = useCommunity();
  const feed = useMemo(() => {
    const filteredPosts = posts
      .filter(p => p && p.user && p.approved) // Add safety checks for post and user
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    
    console.log('CommunityFeed - All posts:', posts);
    console.log('CommunityFeed - Filtered posts:', filteredPosts);
    
    return filteredPosts;
  }, [posts]);
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const [viewerStart, setViewerStart] = React.useState<string | null>(null);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8">
        <div className="max-w-[614px] w-full mx-auto space-y-6">
          <StoriesBar onSelect={(id) => { setViewerStart(id); setViewerOpen(true); }} />
          <CreatePost />
          
          {/* Add Users to Firebase - Remove after adding users */}
          <div className="border-2 border-dashed border-green-300 rounded-lg p-4 bg-green-50">
            <h3 className="text-lg font-semibold text-green-800 mb-2">👥 Add Your Users to Firebase</h3>
            <p className="text-sm text-green-700 mb-4">
              Add your two users to Firebase so they can discover and chat with each other.
            </p>
            <AddUsersToFirebase />
          </div>
          
          {feed.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">No posts yet. Be the first to share your eco-action!</div>
          ) : (
            feed.map(p => (
              <PostCard 
                key={p.id} 
                post={p} 
                onMessageUser={(userId) => {
                  setSelectedUserId(userId);
                  setMessagesOpen(true);
                }}
              />
            ))
          )}
        </div>
        <div className="hidden lg:block">
          <CommunityRightSidebar />
        </div>
      </div>
      <StoryViewer open={viewerOpen} onOpenChange={setViewerOpen} startId={viewerStart} />
      <MessagesModal 
        open={messagesOpen} 
        onOpenChange={setMessagesOpen} 
        partner={selectedUserId ? { id: selectedUserId, name: 'User', avatarUrl: null } : undefined}
      />
    </div>
  );
};

export default CommunityFeed;
