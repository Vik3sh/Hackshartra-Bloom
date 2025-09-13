-- GoGreen Messaging System - Supabase Tables Setup
-- Run this in your Supabase SQL Editor

-- 1. Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video')),
  media_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create conversations table (for easier querying)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant1_id, participant2_id)
);

-- 3. Create user profiles table (if not exists)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations(participant1_id, participant2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at);

-- 5. Create function to get or create conversation
CREATE OR REPLACE FUNCTION get_or_create_conversation(
  user1_id UUID,
  user2_id UUID
) RETURNS UUID AS $$
DECLARE
  conversation_id UUID;
  participant1 UUID;
  participant2 UUID;
BEGIN
  -- Ensure consistent ordering
  IF user1_id < user2_id THEN
    participant1 := user1_id;
    participant2 := user2_id;
  ELSE
    participant1 := user2_id;
    participant2 := user1_id;
  END IF;

  -- Try to get existing conversation
  SELECT id INTO conversation_id
  FROM conversations
  WHERE participant1_id = participant1 AND participant2_id = participant2;

  -- Create conversation if it doesn't exist
  IF conversation_id IS NULL THEN
    INSERT INTO conversations (participant1_id, participant2_id)
    VALUES (participant1, participant2)
    RETURNING id INTO conversation_id;
  END IF;

  RETURN conversation_id;
END;
$$ LANGUAGE plpgsql;

-- 6. Create function to get conversation messages
CREATE OR REPLACE FUNCTION get_conversation_messages(
  user1_id UUID,
  user2_id UUID,
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
) RETURNS TABLE (
  id UUID,
  sender_id UUID,
  receiver_id UUID,
  content TEXT,
  message_type TEXT,
  media_url TEXT,
  read BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.sender_id,
    m.receiver_id,
    m.content,
    m.message_type,
    m.media_url,
    m.read,
    m.created_at
  FROM messages m
  WHERE 
    (m.sender_id = user1_id AND m.receiver_id = user2_id) OR
    (m.sender_id = user2_id AND m.receiver_id = user1_id)
  ORDER BY m.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- 7. Create function to get user conversations
CREATE OR REPLACE FUNCTION get_user_conversations(user_id UUID)
RETURNS TABLE (
  conversation_id UUID,
  other_user_id UUID,
  other_user_name TEXT,
  other_user_avatar TEXT,
  last_message_content TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  unread_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as conversation_id,
    CASE 
      WHEN c.participant1_id = user_id THEN c.participant2_id
      ELSE c.participant1_id
    END as other_user_id,
    CASE 
      WHEN c.participant1_id = user_id THEN p2.full_name
      ELSE p1.full_name
    END as other_user_name,
    CASE 
      WHEN c.participant1_id = user_id THEN p2.avatar_url
      ELSE p1.avatar_url
    END as other_user_avatar,
    m.content as last_message_content,
    c.last_message_at,
    COALESCE(unread.count, 0) as unread_count
  FROM conversations c
  LEFT JOIN user_profiles p1 ON p1.id = c.participant1_id
  LEFT JOIN user_profiles p2 ON p2.id = c.participant2_id
  LEFT JOIN messages m ON m.id = c.last_message_id
  LEFT JOIN (
    SELECT 
      CASE 
        WHEN sender_id = user_id THEN receiver_id
        ELSE sender_id
      END as other_user,
      COUNT(*) as count
    FROM messages
    WHERE (sender_id = user_id OR receiver_id = user_id)
      AND receiver_id = user_id
      AND read = FALSE
    GROUP BY other_user
  ) unread ON unread.other_user = CASE 
    WHEN c.participant1_id = user_id THEN c.participant2_id
    ELSE c.participant1_id
  END
  WHERE c.participant1_id = user_id OR c.participant2_id = user_id
  ORDER BY c.last_message_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger to update conversation when message is sent
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
DECLARE
  participant1 UUID;
  participant2 UUID;
BEGIN
  -- Ensure consistent ordering
  IF NEW.sender_id < NEW.receiver_id THEN
    participant1 := NEW.sender_id;
    participant2 := NEW.receiver_id;
  ELSE
    participant1 := NEW.receiver_id;
    participant2 := NEW.sender_id;
  END IF;

  -- Update or insert conversation
  INSERT INTO conversations (participant1_id, participant2_id, last_message_id, last_message_at)
  VALUES (participant1, participant2, NEW.id, NEW.created_at)
  ON CONFLICT (participant1_id, participant2_id)
  DO UPDATE SET 
    last_message_id = NEW.id,
    last_message_at = NEW.created_at,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_message();

-- 9. Enable Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies
-- Messages: Users can only see messages they sent or received
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert their own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" ON messages
  FOR UPDATE USING (auth.uid() = sender_id);

-- Conversations: Users can only see conversations they participate in
CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- User profiles: Users can view all profiles, but only update their own
CREATE POLICY "Users can view all profiles" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 11. Insert some sample users for testing
INSERT INTO user_profiles (id, full_name, avatar_url, bio, followers_count, following_count, posts_count)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Green Thumb', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', 'Plant lover and sustainability advocate', 89, 45, 23),
  ('00000000-0000-0000-0000-000000000002', 'Eco Explorer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', 'Exploring sustainable living', 156, 78, 34),
  ('00000000-0000-0000-0000-000000000003', 'Nature Lover', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', 'Passionate about environmental conservation', 203, 92, 41),
  ('00000000-0000-0000-0000-000000000004', 'Climate Warrior', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', 'Fighting for a better planet', 312, 156, 67)
ON CONFLICT (id) DO NOTHING;

-- 12. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON messages TO authenticated;
GRANT ALL ON conversations TO authenticated;
GRANT ALL ON user_profiles TO authenticated;
GRANT EXECUTE ON FUNCTION get_or_create_conversation TO authenticated;
GRANT EXECUTE ON FUNCTION get_conversation_messages TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_conversations TO authenticated;
