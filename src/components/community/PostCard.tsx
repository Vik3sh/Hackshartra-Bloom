import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { PostItem } from '@/contexts/CommunityContext';
import { useCommunity } from '@/contexts/CommunityContext';

const timeAgoFromISO = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d`;
  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
};

const STORAGE_BOOKMARKS = 'communityBookmarks_v1';

const PostCard: React.FC<{ post: PostItem }> = ({ post }) => {
  const { likePost, unlikePost, addComment, currentUser } = useCommunity();
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_BOOKMARKS);
      const set: string[] = raw ? JSON.parse(raw) : [];
      setBookmarked(set.includes(post.id));
    } catch {}
  }, [post.id]);

  const saveBookmark = (on: boolean) => {
    try {
      const raw = localStorage.getItem(STORAGE_BOOKMARKS);
      const set: string[] = raw ? JSON.parse(raw) : [];
      const next = on ? Array.from(new Set([...set, post.id])) : set.filter(id => id !== post.id);
      localStorage.setItem(STORAGE_BOOKMARKS, JSON.stringify(next));
    } catch {}
  };

  const liked = useMemo(() => currentUser ? post.likes.includes(currentUser.id) : false, [currentUser, post.likes]);

  const onToggleLike = () => {
    if (!currentUser) return;
    liked ? unlikePost(post.id) : likePost(post.id);
  };

  const onAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment(post.id, comment.trim());
    setComment('');
    setShowComments(true);
  };

  return (
    <Card className="rounded-lg overflow-hidden border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="p-[2px] rounded-full bg-gradient-to-tr from-green-500 via-emerald-400 to-green-600">
            <div className="p-[2px] bg-white rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.user.avatarUrl || undefined} />
                <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">{post.user.name}</div>
            <div className="text-[10px] text-muted-foreground">{timeAgoFromISO(post.createdAt)}</div>
          </div>
        </div>
        <button className="p-1 rounded hover:bg-slate-100" aria-label="More">
          <MoreHorizontal className="h-5 w-5 text-slate-600" />
        </button>
      </div>

      {/* Media */}
      {post.mediaType === 'image' ? (
        <img src={post.mediaUrl} alt={post.caption} className="w-full max-h-[700px] object-contain bg-black/5" />
      ) : (
        <video src={post.mediaUrl} controls className="w-full max-h-[700px] bg-black" />
      )}

      {/* Actions */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onToggleLike} className="p-1" aria-label="Like">
              <Heart className={`h-6 w-6 transition-colors ${liked ? 'fill-green-600 stroke-green-600' : 'text-slate-700 hover:text-green-600'}`} />
            </button>
            <button onClick={() => setShowComments(v => !v)} className="p-1" aria-label="Comment">
              <MessageCircle className="h-6 w-6 text-slate-700 hover:text-green-600" />
            </button>
            <button className="p-1" aria-label="Share">
              <Send className="h-6 w-6 text-slate-700 hover:text-green-600" />
            </button>
          </div>
          <button onClick={() => { const next = !bookmarked; setBookmarked(next); saveBookmark(next); }} className="p-1" aria-label="Bookmark">
            <Bookmark className={`h-6 w-6 ${bookmarked ? 'fill-slate-800 stroke-slate-800' : 'text-slate-700 hover:text-green-600'}`} />
          </button>
        </div>

        {/* Likes count */}
        <div className="px-1 pt-2 text-sm font-semibold text-slate-900">{post.likes.length} likes</div>

        {/* Caption */}
        <div className="px-1 pt-1 text-sm">
          <span className="font-semibold mr-1">{post.user.name}</span>
          <span className="align-middle">{post.caption}</span>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="px-1 pt-1 text-xs text-green-700 space-x-2">
            {post.tags.map(t => (
              <span key={t}>#{t}</span>
            ))}
          </div>
        )}

        {/* View all comments */}
        {post.comments.length > 0 && (
          <button onClick={() => setShowComments(true)} className="px-1 pt-1 text-sm text-slate-500 hover:text-slate-700">
            View all {post.comments.length} comments
          </button>
        )}

        {/* Comment composer */}
        <form onSubmit={onAddComment} className="flex items-center gap-2 px-1 pt-2">
          <input
            className="flex-1 text-sm border-none outline-none bg-transparent placeholder:text-slate-400"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" disabled={!comment.trim()} className={`text-sm font-semibold ${comment.trim() ? 'text-green-600' : 'text-slate-400'}`}>Post</button>
        </form>

        {/* Comments list */}
        {showComments && post.comments.length > 0 && (
          <div className="pt-2 space-y-2">
            {post.comments.map(c => (
              <div key={c.id} className="flex items-start gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={c.user.avatarUrl || undefined} />
                  <AvatarFallback>{c.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <span className="font-semibold mr-1">{c.user.name}</span>
                  <span>{c.text}</span>
                  <div className="text-[10px] text-muted-foreground">{timeAgoFromISO(c.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className="px-1 pt-2 text-[10px] uppercase tracking-wide text-slate-400">{timeAgoFromISO(post.createdAt)} ago</div>

        {!post.approved && (
          <div className="px-1 pt-2 text-sm text-red-600">This post is hidden: {post.flaggedReason}</div>
        )}
      </div>
    </Card>
  );
};

export default PostCard;
