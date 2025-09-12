import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCommunity } from '@/contexts/CommunityContext';

const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const StoryModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void }> = ({ open, onOpenChange }) => {
  const { addStory } = useCommunity();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setSubmitting(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      addStory({ mediaUrl: dataUrl, caption });
      setFile(null);
      setCaption('');
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post a Story</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="story-media">Photo/Video</Label>
            <Input id="story-media" type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="story-caption">Caption (optional)</Label>
            <Textarea id="story-caption" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Share more context..." />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting || !file} className="bg-green-600 hover:bg-green-700 text-white">
              {submitting ? 'Posting...' : 'Post Story'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StoryModal;
