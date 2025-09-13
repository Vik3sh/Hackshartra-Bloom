const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

// Enable CORS for all routes
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true
}));

app.use(express.json());

// In-memory storage (in production, use a database)
const users = new Map(); // userId -> { id, name, avatarUrl, socketId }
const messages = new Map(); // conversationId -> [messages]
const conversations = new Map(); // conversationId -> { participants, lastMessage, createdAt }

// REST API endpoints
app.get('/api/users', (req, res) => {
  const userList = Array.from(users.values()).map(user => ({
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    online: !!user.socketId
  }));
  res.json(userList);
});

app.get('/api/messages/:conversationId', (req, res) => {
  const conversationId = req.params.conversationId;
  const conversationMessages = messages.get(conversationId) || [];
  res.json(conversationMessages);
});

app.post('/api/messages', (req, res) => {
  const { senderId, receiverId, content, messageType = 'text', mediaUrl } = req.body;
  
  const conversationId = [senderId, receiverId].sort().join('_');
  const message = {
    id: uuidv4(),
    senderId,
    receiverId,
    content,
    messageType,
    mediaUrl,
    createdAt: new Date().toISOString(),
    read: false
  };

  // Store message
  if (!messages.has(conversationId)) {
    messages.set(conversationId, []);
  }
  messages.get(conversationId).push(message);

  // Update conversation
  conversations.set(conversationId, {
    participants: [senderId, receiverId],
    lastMessage: message,
    createdAt: new Date().toISOString()
  });

  // Emit to both users if they're online
  const sender = users.get(senderId);
  const receiver = users.get(receiverId);
  
  if (sender?.socketId) {
    io.to(sender.socketId).emit('messageReceived', message);
  }
  if (receiver?.socketId) {
    io.to(receiver.socketId).emit('messageReceived', message);
  }

  res.json({ success: true, message });
});

// Socket.io for real-time communication
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins
  socket.on('userJoin', (userData) => {
    const { id, name, avatarUrl } = userData;
    users.set(id, { id, name, avatarUrl, socketId: socket.id });
    console.log(`User ${name} (${id}) joined`);
    
    // Notify other users
    socket.broadcast.emit('userOnline', { id, name, avatarUrl });
  });

  // User leaves
  socket.on('disconnect', () => {
    const user = Array.from(users.values()).find(u => u.socketId === socket.id);
    if (user) {
      users.set(user.id, { ...user, socketId: null });
      console.log(`User ${user.name} (${user.id}) left`);
      
      // Notify other users
      socket.broadcast.emit('userOffline', { id: user.id });
    }
  });

  // Send message
  socket.on('sendMessage', (messageData) => {
    const { senderId, receiverId, content, messageType, mediaUrl } = messageData;
    
    const conversationId = [senderId, receiverId].sort().join('_');
    const message = {
      id: uuidv4(),
      senderId,
      receiverId,
      content,
      messageType,
      mediaUrl,
      createdAt: new Date().toISOString(),
      read: false
    };

    // Store message
    if (!messages.has(conversationId)) {
      messages.set(conversationId, []);
    }
    messages.get(conversationId).push(message);

    // Update conversation
    conversations.set(conversationId, {
      participants: [senderId, receiverId],
      lastMessage: message,
      createdAt: new Date().toISOString()
    });

    // Send to receiver if online
    const receiver = users.get(receiverId);
    if (receiver?.socketId) {
      io.to(receiver.socketId).emit('messageReceived', message);
    }

    // Send confirmation to sender
    socket.emit('messageSent', message);
  });

  // Mark message as read
  socket.on('markAsRead', (messageId) => {
    for (const [conversationId, conversationMessages] of messages.entries()) {
      const message = conversationMessages.find(m => m.id === messageId);
      if (message) {
        message.read = true;
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
});
