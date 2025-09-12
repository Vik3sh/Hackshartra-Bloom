import React, { useMemo } from 'react';
import PostCard from './PostCard';
import { useCommunity } from '@/contexts/CommunityContext';

const DiscoverFeed: React.FC = () => {
  const { posts } = useCommunity();
  const feed = useMemo(() => posts
    .filter(p => p.approved)
    .sort((a, b) => b.likes.length - a.likes.length || b.createdAt.localeCompare(a.createdAt)), [posts]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {feed.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">No trending posts yet.</div>
      ) : (
        feed.map(p => <PostCard key={p.id} post={p} />)
      )}
    </div>
  );
};

export default DiscoverFeed;
