import { createContext, useContext, useState, useEffect } from "react";
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
      
      return () => {
        socket.off("newMessage");
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
      
      // Extract unread counts
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
  };

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
      
      // Mark as read in the UI
      setUnreadCounts(prev => ({
        ...prev,
        [conversationId]: 0
      }));
      
      // Notify server messages are read
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
      
      // If in a conversation, add to messages
      if (currentConversation && 
          currentConversation.participants.some(p => p?._id === receiverId)) {
        setMessages(prev => [...prev, data.data]);
      }
      
      // Emit socket event
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
      
      // Refresh conversations
      fetchConversations();
      
      return data.data;
    } catch (error) {
      console.error("Failed to send message:", error);
      
      // Extract error message if possible
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

  // Load conversations on initial render
  useEffect(() => {
    if (isAuth) {
      fetchConversations();
    }
  }, [isAuth]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        contacts,
        unreadCounts,
        loading,
        fetchConversations,
        fetchMessages,
        sendMessage,
        selectConversation,
        fetchContacts
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);