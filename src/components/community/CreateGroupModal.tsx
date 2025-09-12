import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCommunity } from '@/contexts/CommunityContext';

const GROUPS_KEY = 'communityGroups_v1';

const CreateGroupModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void }> = ({ open, onOpenChange }) => {
  const { currentUser } = useCommunity();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');

  const saveGroup = () => {
    if (!currentUser || !name.trim()) return;
    const group = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: name.trim(),
      description: description.trim(),
      isPublic: privacy === 'public',
      createdBy: currentUser.id,
      memberIds: [currentUser.id],
      createdAt: new Date().toISOString(),
    };
    try {
      const raw = localStorage.getItem(GROUPS_KEY);
      const arr = raw ? JSON.parse(raw) as any[] : [];
      arr.push(group);
      localStorage.setItem(GROUPS_KEY, JSON.stringify(arr));
    } catch {}
    onOpenChange(false);
    setName(''); setDescription(''); setPrivacy('public');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group name</Label>
            <Input id="group-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Local Tree Planters" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-desc">Description</Label>
            <Textarea id="group-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Purpose of the group" />
          </div>
          <div className="space-y-2">
            <Label>Privacy</Label>
            <div className="flex gap-3">
              <Button type="button" variant={privacy === 'public' ? 'default' : 'outline'} onClick={() => setPrivacy('public')}>Public</Button>
              <Button type="button" variant={privacy === 'private' ? 'default' : 'outline'} onClick={() => setPrivacy('private')}>Private</Button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={saveGroup} className="bg-green-600 hover:bg-green-700 text-white">Create</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
