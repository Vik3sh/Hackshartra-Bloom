import React from 'react';
import CommunityFeed from '@/components/community/CommunityFeed';

const Community: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <CommunityFeed />
      </div>
    </div>
  );
};

export default Community;
