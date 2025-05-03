import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './database/db.js';
import cors from 'cors';
import Razorpay from 'razorpay';
import { errorHandler } from './middlewares/TryCatch.js';
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/schema.js';
import http from 'http';
import { Server } from 'socket.io';
import { Message } from './models/Message.js';
import { Conversation } from './models/Conversation.js';

dotenv.config();

import swagger from './swagger.js';

export const instance = new Razorpay({
  key_id: process.env.Razorpay_Key,
  key_secret: process.env.Razorpay_Secret,
});

const app = express();
const port = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*", // In production, limit this to your frontend URL
    methods: ["GET", "POST"]
  }
});

//using middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send("Server is working")
});
app.use('/uploads', express.static('uploads/'));

//importing routes
import userRoutes from './routes/user.js';
import courseRoutes from './routes/course.js';
import adminRoutes from './routes/admin.js';
import chatRoutes from './routes/chat.js';

//using routes
app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', adminRoutes);
app.use('/api/chat', chatRoutes);

app.use('/api-docs', swagger.swaggerUi.serve, swagger.swaggerUi.setup(swagger.specs));

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.use(errorHandler);

// Socket.io logic
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('New client connected');
  
  // When a user connects, store their socket ID
  socket.on('join', (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });
  
  // Handle sending messages
  socket.on('sendMessage', (message) => {
    const receiverSocketId = userSockets.get(message.receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', message);
    }
  });
  
  // Handle marking messages as read
  socket.on('markAsRead', async ({ conversationId, userId }) => {
    try {
      // Update in the database
      await Message.updateMany(
        { conversationId, receiver: userId, isRead: false },
        { isRead: true }
      );
      
      const conversation = await Conversation.findById(conversationId);
      if (conversation) {
        const unreadCount = conversation.unreadCount || new Map();
        unreadCount.set(userId.toString(), 0);
        await Conversation.updateOne(
          { _id: conversationId },
          { unreadCount }
        );
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });
  
  // When a user disconnects
  socket.on('disconnect', () => {
    // Remove user from userSockets map
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Listen on HTTP server instead of app
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});
