// Simple HTTP-based messaging service
// This will work without WebSockets for now

const API_BASE_URL = 'http://localhost:3001/api';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'text' | 'image' | 'video';
  mediaUrl?: string;
  createdAt: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  online: boolean;
}

class MessagingService {
  private messages: Map<string, Message[]> = new Map();
  private users: User[] = [];

  // Get all users
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (response.ok) {
        this.users = await response.json();
        return this.users;
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
    
    // Fallback to local users if server is not available
    return this.getLocalUsers();
  }

  // Get messages for a conversation
  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${conversationId}`);
      if (response.ok) {
        const messages = await response.json();
        this.messages.set(conversationId, messages);
        return messages;
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
    
    // Fallback to local messages
    return this.messages.get(conversationId) || [];
  }

  // Send a message
  async sendMessage(
    senderId: string, 
    receiverId: string, 
    content: string, 
    messageType: 'text' | 'image' | 'video' = 'text',
    mediaUrl?: string
  ): Promise<Message | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId,
          receiverId,
          content,
          messageType,
          mediaUrl
        })
      });

      if (response.ok) {
        const result = await response.json();
        const message = result.message;
        
        // Update local cache
        const conversationId = [senderId, receiverId].sort().join('_');
        if (!this.messages.has(conversationId)) {
          this.messages.set(conversationId, []);
        }
        this.messages.get(conversationId)!.push(message);
        
        return message;
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
    
    // Fallback to local message creation
    return this.createLocalMessage(senderId, receiverId, content, messageType, mediaUrl);
  }

  // Fallback methods for when server is not available
  private getLocalUsers(): User[] {
    // Get users from localStorage or return sample users
    const savedUsers = localStorage.getItem('messaging_users');
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }

    // Return sample users
    return [
      { id: 'user-1', name: 'Green Thumb', avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', online: true },
      { id: 'user-2', name: 'Eco Explorer', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', online: true },
      { id: 'user-3', name: 'Nature Lover', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', online: false },
    ];
  }

  private createLocalMessage(
    senderId: string, 
    receiverId: string, 
    content: string, 
    messageType: 'text' | 'image' | 'video' = 'text',
    mediaUrl?: string
  ): Message {
    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId,
      receiverId,
      content,
      messageType,
      mediaUrl,
      createdAt: new Date().toISOString(),
      read: false
    };

    // Store in localStorage as fallback
    const conversationId = [senderId, receiverId].sort().join('_');
    const existingMessages = JSON.parse(localStorage.getItem(`messages_${conversationId}`) || '[]');
    existingMessages.push(message);
    localStorage.setItem(`messages_${conversationId}`, JSON.stringify(existingMessages));

    return message;
  }

  // Get conversation ID
  getConversationId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join('_');
  }
}

export const messagingService = new MessagingService();
