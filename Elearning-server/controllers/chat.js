import TryCatch from "../middlewares/TryCatch.js";
import { Message } from "../models/Message.js";
import { Conversation } from "../models/Conversation.js";
import { User } from "../models/user.js";
import { Courses } from "../models/Courses.js"; // Make sure path is correct

// Get all conversations for a user
export const getUserConversations = TryCatch(async (req, res) => {
  const userId = req.user._id;
  
  const conversations = await Conversation.find({
    participants: userId
  })
  .populate({
    path: 'participants',
    select: 'name role email'
  })
  .populate({
    path: 'lastMessage',
    select: 'content createdAt'
  })
  .sort({ updatedAt: -1 });
  
  res.status(200).json({
    success: true,
    data: conversations
  });
});

// Get messages for a specific conversation
export const getConversationMessages = TryCatch(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;
  
  // Verify user is part of this conversation
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId
  });
  
  if (!conversation) {
    return res.status(403).json({
      success: false,
      message: "You don't have access to this conversation"
    });
  }
  
  const messages = await Message.find({
    conversationId
  })
  .populate({
    path: 'sender',
    select: 'name role'
  })
  .sort({ createdAt: 1 });
  
  // Mark messages as read
  await Message.updateMany(
    { conversationId, receiver: userId, isRead: false },
    { isRead: true }
  );
  
  // Reset unread count for this user
  const unreadCount = conversation.unreadCount || new Map();
  unreadCount.set(userId.toString(), 0);
  await Conversation.updateOne(
    { _id: conversationId },
    { unreadCount }
  );
  
  res.status(200).json({
    success: true,
    data: messages
  });
});

// Send a new message
export const sendMessage = TryCatch(async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user._id;
  
  // Check if receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({
      success: false,
      message: "Receiver not found"
    });
  }
  
  // Find or create conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] }
  });
  
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
      unreadCount: new Map([[receiverId.toString(), 1]])
    });
  } else {
    // Update unread count
    const unreadCount = conversation.unreadCount || new Map();
    const currentCount = unreadCount.get(receiverId.toString()) || 0;
    unreadCount.set(receiverId.toString(), currentCount + 1);
    conversation.unreadCount = unreadCount;
  }
  
  // Create message
  const message = await Message.create({
    sender: senderId,
    receiver: receiverId,
    content,
    conversationId: conversation._id
  });
  
  // Update conversation's last message
  conversation.lastMessage = message._id;
  await conversation.save();
  
  res.status(201).json({
    success: true,
    data: message
  });
});

// Get all users that can be messaged based on role
export const getContactsList = TryCatch(async (req, res) => {
  const userId = req.user._id;
  const { role } = req.user;
  
  console.log(`Fetching contacts for user: ${userId}, role: ${role}`);
  
  try {
    let contacts = [];
    
    // Filter based on user role
    if (role === "user") {
      // Get courses this student is enrolled in
      const studentUser = await User.findById(userId).select('subscription');
      
      if (!studentUser || !studentUser.subscription) {
        console.log("No subscriptions found for student");
        return res.status(200).json({
          success: true,
          data: []
        });
      }
      
      const courseIds = studentUser.subscription;
      console.log(`Student enrolled in courses: ${courseIds}`);
      
      // Find teachers of those courses
      const coursesWithTeachers = await Courses.find({ 
        _id: { $in: courseIds } 
      }).select('owner');
      
      const teacherIds = coursesWithTeachers.map(course => course.owner);
      console.log(`Teachers of these courses: ${teacherIds}`);
      
      // Get admin users
      const admins = await User.find({ role: "admin" }).select('_id');
      const adminIds = admins.map(admin => admin._id);
      
      // Students can message teachers of their courses and admins
      contacts = await User.find({
        _id: { 
          $in: [...teacherIds, ...adminIds],
          $ne: userId // Exclude the current user
        }
      }).select('name role email');
      
      
      
    } else if (role === "teacher") {
      // Get courses taught by this teacher
      const teacherCourses = await Courses.find({ owner: userId });
      const courseIds = teacherCourses.map(course => course._id);
      
      console.log(`Teacher courses: ${courseIds}`);
      
      // Find students enrolled in those courses
      const enrolledStudents = await User.find({
        subscription: { $in: courseIds },
        role: { $in: ["user", "teacher", "admin"] }
      }).select('_id name role email');
      console.log("Students" + enrolledStudents);
      
      // Get admin users
      const admins = await User.find({ 
        role: "admin",
        _id: { $ne: userId } // Exclude the current user
      }).select('_id name role email');
      
      // Combine students and admins
      contacts = [...enrolledStudents, ...admins];
      console.log(contacts);
      
    } else if (role === "admin") {
      // Admins can message everyone
      contacts = await User.find({ 
        _id: { $ne: userId } // Exclude the current user
      }).select('name role email');
    }
    
    console.log(`Found ${contacts.length} contacts for user ${userId}`);
    
    res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error("Error in getContactsList:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts. Try again later."
    });
  }
}); 