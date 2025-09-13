# Real-Time Messaging Setup Guide

## Step 1: Create New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Project name: `gogreen-messaging`
4. Create strong password (save it!)
5. Choose region closest to you
6. Click "Create new project"

## Step 2: Get Your Credentials

1. Go to **Settings** → **API**
2. Copy your **Project URL**
3. Copy your **Anon public key**

## Step 3: Update Config File

1. Open `src/integrations/supabase/messagingClient.ts`
2. Replace `YOUR_NEW_PROJECT_URL_HERE` with your Project URL
3. Replace `YOUR_NEW_ANON_KEY_HERE` with your Anon key

## Step 4: Create Tables

1. Go to your new Supabase project
2. Click **SQL Editor**
3. Copy and paste this SQL:

```sql
-- Create messaging tables
CREATE TABLE IF NOT EXISTS messaging_users (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  media_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_messages_participants ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Enable RLS
ALTER TABLE messaging_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on messaging_users" ON messaging_users FOR ALL USING (true);
CREATE POLICY "Allow all operations on messages" ON messages FOR ALL USING (true);

-- Insert demo users
INSERT INTO messaging_users (id, full_name, avatar_url, bio) VALUES
('demo-user-1', 'Vikesh Negi', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', 'Environmental enthusiast'),
('demo-user-2', 'Eco Warrior', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', 'Passionate about conservation')
ON CONFLICT (id) DO NOTHING;
```

4. Click **Run**

## Step 5: Test Messaging

1. Refresh your browser
2. Open Messages → "Discover Users"
3. Click "Add Me to Chat"
4. You should see demo users
5. Click "Chat" and send messages!

## That's It! 🎉

Your real-time messaging will now work perfectly with a clean, dedicated Supabase project.