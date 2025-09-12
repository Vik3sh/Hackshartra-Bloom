import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  followers: number;
  following: number;
  posts: number;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface PostItem {
  id: string;
  user: User;
  caption: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  tags: string[];
  likes: string[];
  comments: Comment[];
  createdAt: string;
  approved: boolean;
  flaggedReason?: string;
}

export interface Story {
  id: string;
  user: User;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: string;
  views: string[];
}

interface CommunityContextType {
  posts: PostItem[];
  stories: Story[];
  currentUser: User | null;
  addPost: (post: Omit<PostItem, 'id' | 'createdAt' | 'likes' | 'comments' | 'approved'>) => void;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  addStory: (story: Omit<Story, 'id' | 'createdAt' | 'views'>) => void;
  viewStory: (storyId: string) => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

interface CommunityProviderProps {
  children: ReactNode;
}

export const CommunityProvider: React.FC<CommunityProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem('community_posts');
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      }

      const savedStories = localStorage.getItem('community_stories');
      if (savedStories) {
        setStories(JSON.parse(savedStories));
      } else {
        // Create some sample stories for demo
        const sampleStories: Story[] = [
          {
            id: 'story-1',
            user: {
              id: 'user-1',
              name: 'Green Thumb',
              avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
              bio: 'Plant lover and sustainability advocate',
              followers: 89,
              following: 45,
              posts: 23
            },
            mediaUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=600&fit=crop',
            mediaType: 'image',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            views: []
          },
          {
            id: 'story-2',
            user: {
              id: 'user-2',
              name: 'Eco Explorer',
              avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
              bio: 'Exploring sustainable living',
              followers: 156,
              following: 78,
              posts: 34
            },
            mediaUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
            mediaType: 'image',
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
            views: []
          }
        ];
        setStories(sampleStories);
        localStorage.setItem('community_stories', JSON.stringify(sampleStories));
      }

      const savedUser = localStorage.getItem('community_current_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      } else {
        // Create a default user for demo
        const defaultUser: User = {
          id: 'demo-user',
          name: 'Eco Warrior',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          bio: 'Passionate about environmental conservation',
          followers: 150,
          following: 75,
          posts: 12
        };
        setCurrentUser(defaultUser);
        localStorage.setItem('community_current_user', JSON.stringify(defaultUser));
      }
    } catch (error) {
      console.error('Error loading community data:', error);
    }
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem('community_posts', JSON.stringify(posts));
  }, [posts]);

  // Save stories to localStorage whenever stories change
  useEffect(() => {
    localStorage.setItem('community_stories', JSON.stringify(stories));
  }, [stories]);

  const addPost = (postData: Omit<PostItem, 'id' | 'createdAt' | 'likes' | 'comments' | 'approved'>) => {
    if (!currentUser) return;

    const newPost: PostItem = {
      ...postData,
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
      approved: true
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const likePost = (postId: string) => {
    if (!currentUser) return;

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: [...post.likes, currentUser.id] }
        : post
    ));
  };

  const unlikePost = (postId: string) => {
    if (!currentUser) return;

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes.filter(id => id !== currentUser.id) }
        : post
    ));
  };

  const addComment = (postId: string, text: string) => {
    if (!currentUser) return;

    const newComment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user: currentUser,
      text,
      createdAt: new Date().toISOString()
    };

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));
  };

  const addStory = (storyData: Omit<Story, 'id' | 'createdAt' | 'views'>) => {
    if (!currentUser) return;

    const newStory: Story = {
      ...storyData,
      user: currentUser, // Ensure user is properly set
      id: `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      views: []
    };

    setStories(prev => [newStory, ...prev]);
  };

  const viewStory = (storyId: string) => {
    if (!currentUser) return;

    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, views: [...story.views, currentUser.id] }
        : story
    ));
  };

  const value: CommunityContextType = {
    posts,
    stories,
    currentUser,
    addPost,
    likePost,
    unlikePost,
    addComment,
    addStory,
    viewStory
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};
