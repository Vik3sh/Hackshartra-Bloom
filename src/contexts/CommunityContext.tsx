import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { realTimeMessagingService, Message as ServiceMessage, User as ServiceUser } from '../services/realTimeMessaging';
import { useAuth } from './AuthContext';

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

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
  messageType: 'text' | 'image' | 'video';
  mediaUrl?: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CommunityContextType {
  posts: PostItem[];
  stories: Story[];
  messages: Message[];
  conversations: Conversation[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  addPost: (post: Omit<PostItem, 'id' | 'createdAt' | 'likes' | 'comments' | 'approved' | 'user'>) => { approved: boolean; reason?: string };
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  addStory: (story: Omit<Story, 'id' | 'createdAt' | 'views'>) => void;
  viewStory: (storyId: string) => void;
  sendMessage: (receiverId: string, content: string, messageType?: 'text' | 'image' | 'video', mediaUrl?: string) => void;
  getConversation: (userId: string) => Conversation | null;
  getMessages: (conversationId: string) => Promise<Message[]>;
  markMessageAsRead: (messageId: string) => void;
  markConversationAsRead: (conversationId: string) => void;
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
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Set current user from auth
  useEffect(() => {
    console.log('🔄 CommunityContext: Auth user changed:', user);
    if (user) {
      const communityUser: User = {
        id: user.id,
        name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
        avatarUrl: user.user_metadata?.avatar_url,
        bio: user.user_metadata?.bio || '',
        followers: 0,
        following: 0,
        posts: 0
      };
      setCurrentUser(communityUser);
      console.log('✅ Set current user for messaging:', communityUser);
    } else {
      console.log('❌ No authenticated user found');
      setCurrentUser(null);
    }
  }, [user]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem('community_posts');
      // Start with empty posts - data will come from Supabase
      setPosts([]);

      // Start with empty stories - data will come from Supabase
      setStories([]);

      // Clear any old demo user data from localStorage
      localStorage.removeItem('community_current_user');
      
      // No authenticated user - set to null
      setCurrentUser(null);
      console.log('No authenticated user found');
    } catch (error) {
      console.error('Error loading community data:', error);
    }
  }, []);

  // Note: Data is now stored in Supabase, not localStorage

  const addPost = (postData: Omit<PostItem, 'id' | 'createdAt' | 'likes' | 'comments' | 'approved' | 'user'>) => {
    if (!currentUser) return { approved: false, reason: 'User not authenticated' };

    // More lenient content moderation - approve most posts by default
    const environmentalKeywords = ['tree', 'plant', 'green', 'eco', 'environment', 'sustainable', 'recycle', 'clean', 'nature', 'earth', 'climate', 'energy', 'water', 'conservation', 'save', 'help', 'care', 'protect', 'future', 'world', 'planet', 'beautiful', 'amazing', 'love', 'peace', 'hope', 'change', 'action', 'community', 'together', 'share', 'inspire', 'motivate', 'positive', 'good', 'better', 'improve', 'grow', 'learn', 'teach', 'educate', 'awareness', 'consciousness', 'mindful', 'responsible', 'ethical', 'organic', 'natural', 'fresh', 'pure', 'healthy', 'wellness', 'lifestyle', 'habits', 'routine', 'daily', 'everyday', 'simple', 'easy', 'tips', 'advice', 'ideas', 'solutions', 'problems', 'challenges', 'goals', 'dreams', 'vision', 'mission', 'purpose', 'meaning', 'value', 'worth', 'important', 'significant', 'impact', 'difference', 'contribution', 'participation', 'involvement', 'engagement', 'connection', 'relationship', 'bond', 'unity', 'harmony', 'balance', 'equilibrium', 'stability', 'security', 'safety', 'protection', 'preservation', 'maintenance', 'care', 'attention', 'focus', 'concentration', 'dedication', 'commitment', 'persistence', 'patience', 'understanding', 'compassion', 'empathy', 'kindness', 'generosity', 'giving', 'sharing', 'caring', 'loving', 'supporting', 'encouraging', 'motivating', 'inspiring', 'uplifting', 'empowering', 'enabling', 'facilitating', 'promoting', 'advocating', 'championing', 'supporting', 'backing', 'endorsing', 'recommending', 'suggesting', 'proposing', 'offering', 'providing', 'supplying', 'delivering', 'bringing', 'creating', 'making', 'building', 'constructing', 'developing', 'growing', 'expanding', 'extending', 'spreading', 'sharing', 'communicating', 'expressing', 'showing', 'demonstrating', 'proving', 'validating', 'confirming', 'verifying', 'checking', 'testing', 'trying', 'experimenting', 'exploring', 'discovering', 'finding', 'learning', 'understanding', 'knowing', 'realizing', 'recognizing', 'acknowledging', 'appreciating', 'valuing', 'respecting', 'honoring', 'celebrating', 'commemorating', 'remembering', 'recalling', 'reflecting', 'thinking', 'considering', 'pondering', 'contemplating', 'meditating', 'focusing', 'concentrating', 'centering', 'grounding', 'rooting', 'anchoring', 'stabilizing', 'balancing', 'harmonizing', 'integrating', 'unifying', 'connecting', 'linking', 'joining', 'combining', 'merging', 'blending', 'mixing', 'fusing', 'synthesizing', 'creating', 'generating', 'producing', 'making', 'building', 'constructing', 'developing', 'growing', 'expanding', 'extending', 'spreading', 'sharing', 'communicating', 'expressing', 'showing', 'demonstrating', 'proving', 'validating', 'confirming', 'verifying', 'checking', 'testing', 'trying', 'experimenting', 'exploring', 'discovering', 'finding', 'learning', 'understanding', 'knowing', 'realizing', 'recognizing', 'acknowledging', 'appreciating', 'valuing', 'respecting', 'honoring', 'celebrating', 'commemorating', 'remembering', 'recalling', 'reflecting', 'thinking', 'considering', 'pondering', 'contemplating', 'meditating', 'focusing', 'concentrating', 'centering', 'grounding', 'rooting', 'anchoring', 'stabilizing', 'balancing', 'harmonizing', 'integrating', 'unifying', 'connecting', 'linking', 'joining', 'combining', 'merging', 'blending', 'mixing', 'fusing', 'synthesizing'];
    const content = (postData.caption + ' ' + postData.tags.join(' ')).toLowerCase();
    const hasEnvironmentalContent = environmentalKeywords.some(keyword => content.includes(keyword));

    // Approve most posts by default, only flag obvious spam or inappropriate content
    const approved = hasEnvironmentalContent || postData.caption.length > 10; // Approve if it has environmental content OR is a substantial post
    const reason = approved ? undefined : 'Post too short or lacks environmental content';

    const newPost: PostItem = {
      ...postData,
      user: currentUser, // Ensure the post uses the current user's information
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
      approved,
      flaggedReason: reason
    };

    console.log('Creating new post:', { 
      approved, 
      reason, 
      content, 
      hasEnvironmentalContent,
      currentUser: currentUser?.name,
      newPostUser: newPost.user?.name
    });
    setPosts(prev => [newPost, ...prev]);

    return { approved, reason };
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

  // Message functions
  const sendMessage = useCallback(async (receiverId: string, content: string, messageType: 'text' | 'image' | 'video' = 'text', mediaUrl?: string) => {
    if (!currentUser) return;

    console.log('Sending message via Supabase:', { senderId: currentUser.id, receiverId, content });

    try {
      const newMessage = await realTimeMessagingService.sendMessage(
        currentUser.id,
        receiverId,
        content,
        messageType,
        mediaUrl
      );

      console.log('Message sent to Supabase:', newMessage);

      if (newMessage) {
        // Convert ServiceMessage to Message format
        const convertedMessage: Message = {
          id: newMessage.id,
          senderId: newMessage.sender_id,
          receiverId: newMessage.receiver_id,
          content: newMessage.content,
          messageType: newMessage.message_type,
          mediaUrl: newMessage.media_url || '',
          createdAt: newMessage.created_at,
          read: newMessage.read
        };
        
        console.log('Adding message to local state:', convertedMessage);
        setMessages(prev => [convertedMessage, ...prev]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [currentUser, setMessages]);

  const getConversation = (userId: string) => {
    if (!currentUser) return null;
    
    const conversationId = [currentUser.id, userId].sort().join('_');
    const conversationMessages = messages.filter(
      msg => (msg.senderId === currentUser.id && msg.receiverId === userId) ||
             (msg.senderId === userId && msg.receiverId === currentUser.id)
    );
    
    if (conversationMessages.length === 0) return null;

    return {
      id: conversationId,
      participants: [currentUser, { id: userId, name: 'Unknown User', followers: 0, following: 0, posts: 0 }],
      lastMessage: conversationMessages[0],
      unreadCount: conversationMessages.filter(msg => msg.receiverId === currentUser.id && !msg.read).length,
      createdAt: conversationMessages[conversationMessages.length - 1].createdAt,
      updatedAt: conversationMessages[0].createdAt
    };
  };

  const getMessages = useCallback(async (conversationId: string) => {
    if (!currentUser) return [];
    
    try {
      const [userId1, userId2] = conversationId.split('_');
      const serviceMessages = await realTimeMessagingService.getMessages(userId1, userId2);
      
      // Convert ServiceMessage to Message format
      const convertedMessages: Message[] = serviceMessages.map(msg => ({
        id: msg.id,
        senderId: msg.sender_id,
        receiverId: msg.receiver_id,
        content: msg.content,
        messageType: msg.message_type,
        mediaUrl: msg.media_url || '',
        createdAt: msg.created_at,
        read: msg.read
      }));
      
      return convertedMessages;
    } catch (error) {
      console.error('Failed to get messages:', error);
      return [];
    }
  }, [currentUser]);

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const markConversationAsRead = (conversationId: string) => {
    const [userId1, userId2] = conversationId.split('_');
    setMessages(prev => prev.map(msg => 
      ((msg.senderId === userId1 && msg.receiverId === userId2) ||
       (msg.senderId === userId2 && msg.receiverId === userId1)) && !msg.read
        ? { ...msg, read: true }
        : msg
    ));
  };

  const value: CommunityContextType = {
    posts,
    stories,
    messages,
    conversations,
    currentUser,
    setCurrentUser,
    addPost,
    likePost,
    unlikePost,
    addComment,
    addStory,
    viewStory,
    sendMessage,
    getConversation,
    getMessages,
    markMessageAsRead,
    markConversationAsRead
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};
