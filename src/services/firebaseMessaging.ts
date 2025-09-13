import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  updateDoc,
  serverTimestamp,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../integrations/firebase/config';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'text' | 'image' | 'video';
  mediaUrl?: string;
  read: boolean;
  createdAt: Timestamp;
}

export interface User {
  id: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: {
    content: string;
    senderId: string;
    timestamp: Timestamp;
  };
  unreadCount: number;
}

class FirebaseMessagingService {
  // Get all users
  async getUsers(): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  }

  // Get messages for a conversation
  async getMessages(user1Id: string, user2Id: string, messageLimit: number = 50): Promise<Message[]> {
    try {
      const messagesRef = collection(db, 'messages');
      // Simplified query without orderBy to avoid index requirement
      const q = query(
        messagesRef,
        where('participants', 'array-contains', user1Id),
        limit(messageLimit)
      );

      const snapshot = await getDocs(q);
      const messages: Message[] = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        // Check if both users are in the participants array
        if (data.participants && data.participants.includes(user1Id) && data.participants.includes(user2Id)) {
          messages.push({
            id: doc.id,
            ...data
          } as Message);
        }
      });

      // Sort by createdAt in JavaScript instead of Firestore
      return messages.sort((a, b) => {
        const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
        const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
        return aTime - bTime; // Oldest first
      });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      return [];
    }
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
      const messagesRef = collection(db, 'messages');
      const participants = [senderId, receiverId].sort(); // Sort to ensure consistent conversation IDs
      
      const messageData = {
        senderId,
        receiverId,
        content,
        messageType,
        mediaUrl: mediaUrl || null,
        read: false,
        participants,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(messagesRef, messageData);
      
      // Get the actual document to retrieve the server timestamp
      const docSnap = await getDoc(docRef);
      const actualData = docSnap.data();
      
      // Update conversation
      await this.updateConversation(senderId, receiverId, content, senderId);
      
      return {
        id: docRef.id,
        ...actualData,
        createdAt: actualData?.createdAt || new Date()
      } as Message;
    } catch (error) {
      console.error('Failed to send message:', error);
      return null;
    }
  }

  // Get user conversations
  async getConversations(userId: string): Promise<Conversation[]> {
    try {
      const conversationsRef = collection(db, 'conversations');
      const q = query(
        conversationsRef,
        where('participants', 'array-contains', userId)
      );

      const snapshot = await getDocs(q);
      const conversations: Conversation[] = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        conversations.push({
          id: doc.id,
          ...data
        } as Conversation);
      });

      return conversations.sort((a, b) => {
        if (!a.lastMessage || !b.lastMessage) return 0;
        return b.lastMessage.timestamp.toMillis() - a.lastMessage.timestamp.toMillis();
      });
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      return [];
    }
  }

  // Mark message as read
  async markMessageAsRead(messageId: string): Promise<boolean> {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, { read: true });
      return true;
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      return false;
    }
  }

  // Mark all messages in conversation as read
  async markConversationAsRead(user1Id: string, user2Id: string): Promise<boolean> {
    try {
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
        where('participants', 'array-contains', user1Id)
      );

      const snapshot = await getDocs(q);
      const updatePromises: Promise<any>[] = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.participants.includes(user1Id) && data.participants.includes(user2Id) && !data.read) {
          updatePromises.push(updateDoc(doc.ref, { read: true }));
        }
      });

      await Promise.all(updatePromises);
      return true;
    } catch (error) {
      console.error('Failed to mark conversation as read:', error);
      return false;
    }
  }

  // Get or create user profile
  async getOrCreateUserProfile(userId: string, userData: any): Promise<User | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDocs(query(collection(db, 'users'), where('id', '==', userId)));
      
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        return { id: userId, ...userData } as User;
      }

      // Create new user profile
      const newUserData = {
        id: userId,
        fullName: userData.full_name || userData.name || 'User',
        avatarUrl: userData.avatar_url || null,
        bio: userData.bio || '',
        followersCount: 0,
        followingCount: 0,
        postsCount: 0
      };

      await addDoc(collection(db, 'users'), newUserData);
      return newUserData as User;
    } catch (error) {
      console.error('Failed to get or create user profile:', error);
      return null;
    }
  }

  // Subscribe to messages between two users
  subscribeToMessages(user1Id: string, user2Id: string, onMessages: (messages: Message[]) => void) {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('participants', 'array-contains', user1Id)
    );

    return onSnapshot(q, (snapshot) => {
      const messages: Message[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        // Check if both users are in the participants array
        if (data.participants && data.participants.includes(user1Id) && data.participants.includes(user2Id)) {
          messages.push({
            id: doc.id,
            ...data
          } as Message);
        }
      });

      // Sort by createdAt in JavaScript
      const sortedMessages = messages.sort((a, b) => {
        const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
        const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
        return aTime - bTime; // Oldest first
      });

      onMessages(sortedMessages);
    });
  }

  // Subscribe to conversation updates
  subscribeToConversations(userId: string, onUpdate: (conversation: Conversation) => void) {
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', userId)
    );

    return onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const data = change.doc.data();
          onUpdate({
            id: change.doc.id,
            ...data
          } as Conversation);
        }
      });
    });
  }

  // Update conversation with last message
  private async updateConversation(user1Id: string, user2Id: string, content: string, senderId: string) {
    try {
      const participants = [user1Id, user2Id].sort();
      const conversationId = participants.join('_');
      
      const conversationRef = doc(db, 'conversations', conversationId);
      const conversationData = {
        participants,
        lastMessage: {
          content,
          senderId,
          timestamp: serverTimestamp()
        },
        unreadCount: senderId === user1Id ? 0 : 1 // Increment unread count for receiver
      };

      await updateDoc(conversationRef, conversationData);
    } catch (error) {
      // If conversation doesn't exist, create it
      try {
        const participants = [user1Id, user2Id].sort();
        const conversationId = participants.join('_');
        
        await addDoc(collection(db, 'conversations'), {
          id: conversationId,
          participants,
          lastMessage: {
            content,
            senderId,
            timestamp: serverTimestamp()
          },
          unreadCount: senderId === user1Id ? 0 : 1
        });
      } catch (createError) {
        console.error('Failed to create conversation:', createError);
      }
    }
  }
}

export const firebaseMessagingService = new FirebaseMessagingService();
