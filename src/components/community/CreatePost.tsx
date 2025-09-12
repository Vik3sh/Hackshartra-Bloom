import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCommunity } from '@/contexts/CommunityContext';
import { useToast } from '@/hooks/use-toast';

const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const CreatePost: React.FC = () => {
  const { addPost, currentUser } = useCommunity();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast({ title: 'Sign in required', description: 'Please sign in to post.', variant: 'destructive' });
      return;
    }
    if (!file) {
      toast({ title: 'Add media', description: 'Please select an image or video.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const mediaType = file.type.startsWith('video') ? 'video' : 'image';
      const tags = tagsInput.split(/[ ,#]+/).map(t => t.trim()).filter(Boolean);
      const result = addPost({ mediaUrl: dataUrl, mediaType, caption, tags });
      if (result.approved) {
        toast({ title: 'Posted', description: 'Your post is live in the Community feed.' });
      } else {
        toast({ title: 'Flagged', description: result.reason || 'Post was flagged as non-environmental and is hidden from the public feed.', variant: 'destructive' });
      }
      setFile(null);
      setCaption('');
      setTagsInput('');
    } catch (err) {
      toast({ title: 'Upload failed', description: 'Could not process the selected file.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="rounded-3xl bg-white border shadow-sm">
      <CardContent className="p-4">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Describe your environmental activity..." className="min-h-[80px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media">Photo/Video</Label>
              <Input id="media" type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="#TreePlanting, #CleanUpDrive" />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting} className="bg-green-600 hover:bg-green-700 text-white">
              {submitting ? 'Posting...' : 'Share Post'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
