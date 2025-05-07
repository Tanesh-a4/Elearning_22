import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { server } from "../index.js";
import { UserData } from "./UserContext.jsx";
import { io } from "socket.io-client";
import toast from 'react-hot-toast';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user, isAuth } = UserData();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingMessage, setDeletingMessage] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    if (isAuth && user?._id) {
      try {
        console.log("Attempting to connect socket.io");
        const newSocket = io(server);

        newSocket.on('connect', () => {
          console.log('Socket connected successfully');
          newSocket.emit("join", user._id);
        });

        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
        });

        setSocket(newSocket);

        return () => {
          console.log("Disconnecting socket");
          newSocket.disconnect();
        };
      } catch (error) {
        console.error("Socket initialization error:", error);
      }
    }
  }, [isAuth, user]);

  // Listen for new messages
  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        console.log("New message received via socket:", message);
        
        // Update messages if in the current conversation
        if (currentConversation?._id === message.conversationId) {
          setMessages(prev => [...prev, message]);
          
          // Mark message as read
          socket.emit("markAsRead", {
            conversationId: message.conversationId,
            userId: user._id
          });
        } else {
          // Play notification sound if not in the current conversation
          try {
            const audio = new Audio('/notification.mp3');
            audio.play();
          } catch (error) {
            console.log("Audio notification failed:", error);
          }
        }
        
        // Update conversations list
        fetchConversations();
      });
      
      // Listen for message deletion events
      socket.on("messageDeleted", ({ messageId, deleteType }) => {
        console.log("Message deleted via socket:", messageId, deleteType);
        
        if (deleteType === 'for_everyone') {
          // Remove message from current messages if present
          setMessages(prev => prev.filter(msg => msg._id !== messageId));
        }
        
        // Update conversations list to reflect changes
        fetchConversations();
      });
      
      return () => {
        socket.off("newMessage");
        socket.off("messageDeleted");
      };
    }
  }, [socket, currentConversation, user]);

  const fetchConversations = async () => {
    if (!isAuth) return;

    try {
      setLoading(true);
      console.log("Fetching conversations");

      const { data } = await axios.get(`${server}/api/chat/conversations`, {
        headers: { token: localStorage.getItem("token") }
      });

      console.log("Conversations fetched:", data);

      setConversations(data.data || []);

      const counts = {};
      if (Array.isArray(data.data)) {
        data.data.forEach(conv => {
          if (conv.unreadCount && user?._id && conv.unreadCount[user._id]) {
            counts[conv._id] = conv.unreadCount[user._id];
          }
        });
      }
      setUnreadCounts(counts);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, [isAuth, user?._id]);

  const fetchMessages = async (conversationId) => {
    if (!conversationId || conversationId.startsWith('temp-')) {
      setMessages([]);
      return;
    }

    try {
      setLoading(true);
      console.log(`Fetching messages for conversation: ${conversationId}`);

      const { data } = await axios.get(`${server}/api/chat/conversations/${conversationId}/messages`, {
        headers: { token: localStorage.getItem("token") }
      });

      setMessages(data.data || []);

      setUnreadCounts(prev => ({
        ...prev,
        [conversationId]: 0
      }));

      if (socket && user?._id) {
        socket.emit("markAsRead", {
          conversationId,
          userId: user._id
        });
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (receiverId, content) => {
    if (!receiverId || !content.trim()) {
      toast.error("Missing recipient or message content");
      return;
    }

    try {
      console.log(`Sending message to: ${receiverId}`);

      const { data } = await axios.post(`${server}/api/chat/messages`,
        { receiverId, content },
        { headers: { token: localStorage.getItem("token") } }
      );

      console.log("Message sent successfully:", data);

      if (currentConversation &&
        currentConversation.participants.some(p => p?._id === receiverId)) {
        setMessages(prev => [...prev, data.data]);
      }

      if (socket && user) {
        socket.emit("sendMessage", {
          ...data.data,
          sender: {
            _id: user._id,
            name: user.name,
            role: user.role
          }
        });
      }

      fetchConversations();

      return data.data;
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMsg = error.response?.data?.message || "Failed to send message";
      toast.error(errorMsg);
      throw error;
    }
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      console.log("Fetching contacts");

      const { data } = await axios.get(`${server}/api/chat/contacts`, {
        headers: { token: localStorage.getItem("token") }
      });

      console.log("Contacts fetched:", data);
      setContacts(data.data || []);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (conversation) => {
    setCurrentConversation(conversation);

    if (conversation && !conversation._id.startsWith('temp-')) {
      await fetchMessages(conversation._id);
    } else {
      setMessages([]);
    }
  };

  // New function to delete a message
  const deleteMessage = async (messageId, deleteOption) => {
    console.log("the delete from frontend is called")
    if (!messageId || !currentConversation?._id) {
      toast.error("Message or conversation ID is missing");
      return;
    }
    
    try {
      setDeletingMessage(true);
      console.log(`Deleting message: ${messageId}, type: ${deleteOption}`);
      
      // Map UI delete options to backend delete types
      const deleteType = deleteOption === 'for_me' ? 'deleteForMe' : 'deleteForEveryone';

      console.log(deleteType)
      const { data } = await axios.post(`${server}/api/chat/conversation/clear`,
  { 
    conversationId: currentConversation._id,
    deleteType,
    messageId
  },
  { headers: { token: localStorage.getItem("token") } }
);

      
      console.log("Message deleted response:", data);
      
      // Update UI based on delete type
      if (deleteOption === 'for_me') {
        // Optimistically update UI to hide this message for current user
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
        toast.success("Message deleted for you");
      } else if (deleteOption === 'for_everyone') {
        // Remove message from UI
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
        
        // Notify others about message deletion via socket
        if (socket) {
          socket.emit("deleteMessage", {
            messageId,
            conversationId: currentConversation._id,
            deleteType: deleteOption
          });
        }
        
        toast.success("Message deleted for everyone");
      }
      
      // Refresh conversations to reflect changes
      fetchConversations();
      
      return data;
    } catch (error) {
      console.error("Failed to delete message:", error);
      
      // Extract error message if possible
      const errorMsg = error.response?.data?.message || "Failed to delete message";
      toast.error(errorMsg);
      
      throw error;
    } finally {
      setDeletingMessage(false);
    }
  };

  // Load conversations on initial render
  useEffect(() => {
    if (isAuth) {
      fetchConversations();
    }
  }, [isAuth, fetchConversations]); // <-- ADD fetchConversations here ✅

  // Listen for new messages
  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        console.log("New message received via socket:", message);

        if (currentConversation?._id === message.conversationId) {
          setMessages(prev => [...prev, message]);

          socket.emit("markAsRead", {
            conversationId: message.conversationId,
            userId: user._id
          });
        } else {
          try {
            const audio = new Audio('/notification.mp3');
            audio.play();
          } catch (error) {
            console.log("Audio notification failed:", error);
          }
        }

        fetchConversations();
      });

      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket, currentConversation, user, fetchConversations]); // <-- ALSO add fetchConversations here ✅

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        contacts,
        unreadCounts,
        loading,
        deletingMessage,
        fetchConversations,
        fetchMessages,
        sendMessage,
        selectConversation,
        fetchContacts,
        deleteMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
