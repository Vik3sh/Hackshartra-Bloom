import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useCommunity } from '@/contexts/CommunityContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StoryViewer: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; startId?: string | null }> = ({ open, onOpenChange, startId }) => {
  const { stories } = useCommunity();
  const [index, setIndex] = useState(0);

  const storyIndex = useMemo(() => {
    const i = stories.findIndex(s => s.id === startId);
    return i >= 0 ? i : 0;
  }, [stories, startId]);

  useEffect(() => {
    setIndex(storyIndex);
  }, [storyIndex]);

  const next = () => setIndex((i) => i + 1 < stories.length ? i + 1 : 0);
  const prev = () => setIndex((i) => i - 1 >= 0 ? i - 1 : stories.length - 1);

  const current = stories[index];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 bg-black/90 text-white border-0">
        <DialogTitle className="sr-only">Story viewer</DialogTitle>
        {current && current.user ? (
          <div className="relative">
            <div className="flex items-center gap-3 p-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={current.user?.avatarUrl || undefined} />
                <AvatarFallback>{current.user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="text-sm font-semibold">{current.user?.name || 'Unknown'}</div>
            </div>
            <div className="relative bg-black">
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              {/\.(mp4|webm|ogg)(\?.*)?$/i.test(current.mediaUrl) || current.mediaUrl.startsWith('data:video') ? (
                <video src={current.mediaUrl} controls className="w-full max-h-[70vh] mx-auto" />
              ) : (
                <img src={current.mediaUrl} alt={current.caption || ''} className="w-full max-h-[70vh] object-contain mx-auto" />
              )}
            </div>
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button onClick={prev} className="h-12 w-12 flex items-center justify-center text-white/80 hover:text-white">
                <ChevronLeft className="h-8 w-8" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button onClick={next} className="h-12 w-12 flex items-center justify-center text-white/80 hover:text-white">
                <ChevronRight className="h-8 w-8" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">No stories</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StoryViewer;
