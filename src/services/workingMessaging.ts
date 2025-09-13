// Simple working real-time messaging using localStorage + polling
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
}

class WorkingMessagingService {
  private messages: Message[] = [];
  private users: User[] = [];
  private listeners: ((messages: Message[]) => void)[] = [];

  constructor() {
    this.loadFromStorage();
    // Poll every 1 second for real-time updates
    setInterval(() => {
      this.loadFromStorage();
      this.notifyListeners();
    }, 1000);
  }

  private loadFromStorage() {
    try {
      const savedMessages = localStorage.getItem('working_messages');
      if (savedMessages) {
        this.messages = JSON.parse(savedMessages);
      }

      const savedUsers = localStorage.getItem('working_users');
      if (savedUsers) {
        this.users = JSON.parse(savedUsers);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('working_messages', JSON.stringify(this.messages));
      localStorage.setItem('working_users', JSON.stringify(this.users));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.messages]));
  }

  // Add user
  addUser(user: User) {
    const existingUser = this.users.find(u => u.id === user.id);
    if (!existingUser) {
      this.users.push(user);
      this.saveToStorage();
      console.log('Added user:', user);
    }
    return user;
  }

  // Get all users
  getUsers(): User[] {
    return [...this.users];
  }

  // Send message
  sendMessage(senderId: string, receiverId: string, content: string): Message {
    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId,
      receiverId,
      content,
      createdAt: new Date().toISOString(),
      read: false
    };

    this.messages.push(message);
    this.saveToStorage();
    this.notifyListeners();
    
    console.log('Message sent:', message);
    return message;
  }

  // Get messages between two users
  getMessages(user1Id: string, user2Id: string): Message[] {
    return this.messages
      .filter(msg => 
        (msg.senderId === user1Id && msg.receiverId === user2Id) ||
        (msg.senderId === user2Id && msg.receiverId === user1Id)
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // Subscribe to message updates
  subscribeToMessages(user1Id: string, user2Id: string, callback: (messages: Message[]) => void) {
    const listener = (allMessages: Message[]) => {
      const conversationMessages = allMessages.filter(msg => 
        (msg.senderId === user1Id && msg.receiverId === user2Id) ||
        (msg.senderId === user2Id && msg.receiverId === user1Id)
      );
      callback(conversationMessages);
    };

    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

export const workingMessagingService = new WorkingMessagingService();
