// Simple messaging service using localStorage + polling for real-time updates
export interface SimpleMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface SimpleUser {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
}

class SimpleMessagingService {
  private messages: SimpleMessage[] = [];
  private users: SimpleUser[] = [];
  private listeners: ((messages: SimpleMessage[]) => void)[] = [];

  constructor() {
    this.loadFromStorage();
    // Poll for updates every 2 seconds
    setInterval(() => {
      this.loadFromStorage();
      this.notifyListeners();
    }, 2000);
  }

  private loadFromStorage() {
    try {
      const savedMessages = localStorage.getItem('simple_messages');
      if (savedMessages) {
        this.messages = JSON.parse(savedMessages);
      }

      const savedUsers = localStorage.getItem('simple_users');
      if (savedUsers) {
        this.users = JSON.parse(savedUsers);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('simple_messages', JSON.stringify(this.messages));
      localStorage.setItem('simple_users', JSON.stringify(this.users));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.messages]));
  }

  // Add user
  addUser(user: SimpleUser) {
    const existingUser = this.users.find(u => u.id === user.id);
    if (!existingUser) {
      this.users.push(user);
      this.saveToStorage();
      console.log('Added user:', user);
    }
    return user;
  }

  // Get all users
  getUsers(): SimpleUser[] {
    return [...this.users];
  }

  // Send message
  sendMessage(senderId: string, receiverId: string, content: string): SimpleMessage {
    const message: SimpleMessage = {
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
  getMessages(user1Id: string, user2Id: string): SimpleMessage[] {
    return this.messages
      .filter(msg => 
        (msg.senderId === user1Id && msg.receiverId === user2Id) ||
        (msg.senderId === user2Id && msg.receiverId === user1Id)
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // Subscribe to message updates
  subscribeToMessages(user1Id: string, user2Id: string, callback: (messages: SimpleMessage[]) => void) {
    const listener = (allMessages: SimpleMessage[]) => {
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

  // Mark message as read
  markAsRead(messageId: string) {
    const message = this.messages.find(m => m.id === messageId);
    if (message) {
      message.read = true;
      this.saveToStorage();
      this.notifyListeners();
    }
  }
}

export const simpleMessagingService = new SimpleMessagingService();
