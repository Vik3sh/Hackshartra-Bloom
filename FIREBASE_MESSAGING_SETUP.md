# Firebase Messaging Setup Guide

This guide will help you set up Firebase for the messaging system in your GoGreen application.

## Prerequisites

- A Google account
- Node.js and npm installed
- Your GoGreen project running

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "gogreen-messaging")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project dashboard, click on "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database (choose closest to your users)
5. Click "Done"

## Step 3: Get Firebase Configuration

1. In your Firebase project dashboard, click on the gear icon ⚙️
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click "Add app" and select the web icon `</>`
5. Register your app with a nickname (e.g., "GoGreen Web App")
6. Copy the Firebase configuration object

## Step 4: Configure Your App

1. Open `src/integrations/firebase/config.ts`
2. Replace the placeholder values with your Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Set Up Firestore Security Rules

1. In Firebase Console, go to "Firestore Database" → "Rules"
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to users collection
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow read/write access to messages collection
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        (resource.data.participants[0] == request.auth.uid || 
         resource.data.participants[1] == request.auth.uid);
    }
    
    // Allow read/write access to conversations collection
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
        (resource.data.participants[0] == request.auth.uid || 
         resource.data.participants[1] == request.auth.uid);
    }
  }
}
```

3. Click "Publish"

## Step 6: Enable Authentication (Optional)

If you want to use Firebase Authentication:

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" or other providers you want to use

## Step 7: Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to the Community section
3. Try to open the Messages modal
4. Check the browser console for any errors

## Data Structure

The Firebase setup creates the following collections:

### Users Collection (`users`)
```javascript
{
  id: "user-id",
  fullName: "User Name",
  avatarUrl: "https://...",
  bio: "User bio",
  followersCount: 0,
  followingCount: 0,
  postsCount: 0
}
```

### Messages Collection (`messages`)
```javascript
{
  id: "message-id",
  senderId: "sender-user-id",
  receiverId: "receiver-user-id",
  content: "Message content",
  messageType: "text" | "image" | "video",
  mediaUrl: "https://...",
  read: false,
  participants: ["user1-id", "user2-id"],
  createdAt: timestamp
}
```

### Conversations Collection (`conversations`)
```javascript
{
  id: "conversation-id",
  participants: ["user1-id", "user2-id"],
  lastMessage: {
    content: "Last message content",
    senderId: "sender-id",
    timestamp: timestamp
  },
  unreadCount: 0
}
```

## Troubleshooting

### Common Issues:

1. **"Firebase not initialized" error**
   - Check that your Firebase configuration is correct
   - Make sure you've replaced all placeholder values

2. **Permission denied errors**
   - Check your Firestore security rules
   - Make sure the rules allow the operations you're trying to perform

3. **Messages not appearing**
   - Check the browser console for errors
   - Verify that the Firebase project is active
   - Check that the collections are being created properly

4. **Real-time updates not working**
   - Make sure you're using the `onSnapshot` listeners correctly
   - Check that your Firebase project has the necessary permissions

## Next Steps

Once Firebase is set up:

1. Users can discover and message each other
2. Messages are stored in Firestore
3. Real-time updates work automatically
4. You can add more features like push notifications

## Support

If you encounter any issues:

1. Check the Firebase Console for error logs
2. Check the browser console for client-side errors
3. Verify your Firebase configuration
4. Test with a simple message first

The messaging system should now work with real-time updates and persistent storage!
