import React from 'react';
import { useCommunity } from '@/contexts/CommunityContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const StoriesBar: React.FC<{ onSelect?: (id: string) => void }> = ({ onSelect }) => {
  const { stories } = useCommunity();

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-4 px-2 py-3">
        {stories.filter(s => s && s.user).map(s => (
          <button key={s.id} onClick={() => onSelect?.(s.id)} className="flex flex-col items-center gap-2 select-none focus:outline-none">
            <div className="p-[2px] rounded-full bg-gradient-to-tr from-green-500 via-emerald-400 to-green-600">
              <div className="p-[2px] bg-white rounded-full">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={s.user?.avatarUrl || undefined} />
                  <AvatarFallback>{s.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="text-xs text-slate-700 max-w-[72px] truncate">{s.user?.name || 'Unknown'}</div>
          </button>
        ))}
        {stories.length === 0 && (
          <div className="text-sm text-slate-500">No stories yet</div>
        )}
      </div>
    </div>
  );
};

export default StoriesBar;
