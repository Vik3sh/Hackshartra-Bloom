import { supabase } from '../integrations/supabase/client';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'image' | 'video';
  media_url?: string;
  created_at: string;
  read: boolean;
}

export interface User {
  id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

class SupabaseMessagingService {
  // Add user to messaging system
  async addUser(userId: string, fullName: string, avatarUrl?: string, bio?: string) {
    try {
      const { data, error } = await supabase
        .from('messaging_users')
        .upsert({
          id: userId,
          full_name: fullName,
          avatar_url: avatarUrl,
          bio: bio || '',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      console.log('User added to Supabase:', data);
      return data;
    } catch (error) {
      console.error('Error adding user:', error);
      return null;
    }
  }

  // Get all users
  async getUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('messaging_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  // Send message
  async sendMessage(senderId: string, receiverId: string, content: string, messageType: 'text' | 'image' | 'video' = 'text', mediaUrl?: string): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: senderId,
          receiver_id: receiverId,
          content,
          message_type: messageType,
          media_url: mediaUrl || null,
          read: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      console.log('Message sent to Supabase:', data);
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  // Get messages between two users
  async getMessages(user1Id: string, user2Id: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user1Id},receiver_id.eq.${user2Id}),and(sender_id.eq.${user2Id},receiver_id.eq.${user1Id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  // Subscribe to real-time messages
  subscribeToMessages(user1Id: string, user2Id: string, callback: (messages: Message[]) => void) {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${user1Id},sender_id.eq.${user2Id})`
        },
        async () => {
          // Reload messages when there's a change
          const messages = await this.getMessages(user1Id, user2Id);
          callback(messages);
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  }

  // Mark message as read
  async markAsRead(messageId: string) {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }
}

export const supabaseMessagingService = new SupabaseMessagingService();