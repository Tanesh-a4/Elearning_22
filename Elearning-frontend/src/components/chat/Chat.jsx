import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { UserData } from '../../context/UserContext';
import { FaPaperPlane, FaUserCircle, FaSearch, FaTimes, FaBell } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Chat = () => {
  const { 
    conversations, 
    contacts,
    currentConversation, 
    messages, 
    unreadCounts,
    loading, 
    selectConversation, 
    sendMessage,
    fetchContacts
  } = useChat();
console.log(contacts);

  const { user } = UserData();
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showContacts, setShowContacts] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [prevMessageLength, setPrevMessageLength] = useState(0);
  const messagesContainerRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    // Only auto-scroll if:
    // 1. It's a new conversation (prevMessageLength was 0)
    // 2. User has manually set shouldScrollToBottom to true
    // 3. User is already near the bottom
    // 4. The user sent the latest message (last message is from current user)
    
    const isUserNearBottom = () => {
      if (!messagesContainerRef.current) return true;
      
      const container = messagesContainerRef.current;
      const { scrollTop, scrollHeight, clientHeight } = container;
      // If user is within 100px of bottom, consider them "at bottom"
      return scrollHeight - scrollTop - clientHeight < 100;
    };
  
    const isLatestMessageFromUser = () => {
      if (!messages.length || !user?._id) return false;
      const latestMessage = messages[messages.length - 1];
      return latestMessage?.sender?._id === user._id;
    };
  
    const shouldAutoScroll = 
      prevMessageLength === 0 || 
      shouldScrollToBottom || 
      isUserNearBottom() ||
      isLatestMessageFromUser();
      
    if (shouldAutoScroll && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Update previous message length for next comparison
    setPrevMessageLength(messages.length);
  }, [messages, user?._id]);

  // Add a scroll handler to the message container
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    // If user manually scrolls up, disable auto-scroll
    // If they scroll to bottom, re-enable it
    setShouldScrollToBottom(scrollHeight - scrollTop - clientHeight < 20);
  };

  // Calculate total unread messages
  const totalUnread = Object.values(unreadCounts || {}).reduce((sum, count) => sum + count, 0);

  // Filter conversations/contacts based on search term
  const filteredConversations = conversations.filter(conv => {
    // Make sure we have valid participants
    if (!conv.participants || !Array.isArray(conv.participants)) return false;
    
    const otherParticipant = conv.participants.find(p => p && p._id !== user?._id);
    if (!otherParticipant || !otherParticipant.name) return false;
    
    return otherParticipant.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredContacts = contacts.filter(contact => 
    contact && contact.name && contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !currentConversation) return;

    // Safely find receiver
    const receiver = currentConversation.participants.find(p => p && p._id !== user?._id);
    if (!receiver || !receiver._id) {
      toast.error("Recipient not found");
      return;
    }

    try {
      setSendingMessage(true);
      await sendMessage(receiver._id, messageText);
      setMessageText('');
    } catch (error) {
      console.error("Error sending message:", error);
      // Toast is handled in the ChatContext
    } finally {
      setSendingMessage(false);
    }
  };

  const startNewConversation = (contact) => {
    if (!contact || !user) {
      toast.error("Cannot start conversation - missing user data");
      return;
    }
    
    // Create a temporary conversation object
    const newConversation = {
      _id: 'temp-' + Date.now(),
      participants: [user, contact],
      messages: []
    };
    
    selectConversation(newConversation);
    setShowContacts(false);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const getRoleBgColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-teal-500';
      case 'teacher': return 'bg-blue-600';
      case 'student': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getRoleTextColor = (role) => {
    switch (role) {
      case 'admin': return 'text-teal-800';
      case 'teacher': return 'text-blue-800';
      case 'student': return 'text-indigo-800';
      default: return 'text-gray-800';
    }
  };
  
  const getRoleBgLightColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-teal-100';
      case 'teacher': return 'bg-blue-100';
      case 'student': return 'bg-indigo-100';
      default: return 'bg-gray-100';
    }
  };

  // Get initial letter safely
  const getInitial = (name) => {
    return name && typeof name === 'string' ? name.charAt(0) : '?';
  };

  return (
    <div className="flex h-[calc(100vh-120px)] mx-5 my-5 rounded-lg overflow-hidden shadow-lg">
      {/* Sidebar */}
      <div className="w-80 flex flex-col border-r border-gray-200 bg-gray-50">
        <div className="p-5 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
            {totalUnread > 0 && (
              <div className="flex items-center ml-2">
                <FaBell className="text-red-500 mr-1" />
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {totalUnread}
                </span>
              </div>
            )}
          </div>
          <button 
            className="bg-teal-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-teal-700 transition"
            onClick={() => {
              setShowContacts(true);
              fetchContacts();
            }}
          >
            New Message
          </button>
        </div>
        
        <div className="p-4 relative">
          <FaSearch className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {loading && !conversations.length ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">Loading conversations...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-5 text-center">
              <p className="text-gray-600 mb-4">No conversations found</p>
              <button 
                className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition"
                onClick={() => {
                  setShowContacts(true);
                  fetchContacts();
                }}
              >
                Start a new conversation
              </button>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              // Safely find other participant
              const otherParticipant = conv.participants?.find(p => p && p._id !== user?._id);
              if (!otherParticipant) return null;
              
              const hasUnread = unreadCounts[conv._id] > 0;
              
              return (
                <div 
                  key={conv._id} 
                  className={`flex p-3 cursor-pointer border-l-4 ${
                    currentConversation?._id === conv._id 
                      ? 'border-teal-600 bg-teal-50' 
                      : 'border-transparent hover:bg-gray-100'
                  }`}
                  onClick={() => selectConversation(conv)}
                >
                  <div className="relative mr-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${getRoleBgColor(otherParticipant.role)}`}>
                      {getInitial(otherParticipant.name)}
                    </div>
                    {hasUnread && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {unreadCounts[conv._id]}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-900 truncate">{otherParticipant.name}</h4>
                      {conv.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(conv.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBgLightColor(otherParticipant.role)} ${getRoleTextColor(otherParticipant.role)}`}>
                        {otherParticipant.role || 'user'}
                      </span>
                      {conv.lastMessage && (
                        <p className="text-sm text-gray-600 truncate ml-2">
                          {conv.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {currentConversation ? (
          <>
            <div className="p-4 border-b border-gray-200">
              {currentConversation.participants
                .filter(p => p && p._id !== user?._id)
                .map(participant => (
                  <div key={participant._id} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white ${getRoleBgColor(participant.role)}`}>
                      {getInitial(participant.name)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{participant.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBgLightColor(participant.role)} ${getRoleTextColor(participant.role)}`}>
                        {participant.role || 'user'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <div 
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 bg-gray-50"
            >
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  if (!msg || !msg.sender) return null;
                  
                  const isCurrentUser = msg.sender._id === user?._id;
                  return (
                    <div 
                      key={msg._id || index} 
                      className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isCurrentUser && (
                        <div className="mr-2 self-end">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getRoleBgColor(msg.sender.role)}`}>
                            {getInitial(msg.sender.name)}
                          </div>
                        </div>
                      )}
                      <div className={`max-w-xs lg:max-w-md`}>
                        <div className={`rounded-2xl px-4 py-2 ${
                          isCurrentUser 
                            ? 'bg-teal-600 text-white rounded-br-none' 
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                        }`}>
                          <p className="break-words">{msg.content}</p>
                        </div>
                        <span className={`text-xs ${isCurrentUser ? 'text-right' : 'text-left'} block mt-1 text-gray-500`}>
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="p-4 border-t border-gray-200 flex" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                disabled={sendingMessage}
                className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100"
              />
              <button 
                type="submit" 
                disabled={!messageText.trim() || sendingMessage} 
                className={`px-4 rounded-r-md flex items-center justify-center ${
                  !messageText.trim() || sendingMessage
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                {sendingMessage ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FaPaperPlane />
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FaUserCircle className="text-gray-300 text-6xl mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Select a conversation</h3>
            <p className="text-gray-500">Choose an existing conversation or start a new one</p>
          </div>
        )}
      </div>

      {/* Contacts Modal */}
      {showContacts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">New Message</h3>
              <button 
                onClick={() => setShowContacts(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-4 relative">
              <FaSearch className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search contacts..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <svg className="animate-spin h-8 w-8 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <div className="overflow-y-auto flex-1">
                {filteredContacts.length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-gray-500 mb-2">No contacts found</p>
                    {user?.role === 'student' && (
                      <p className="text-sm text-gray-400">You can only message teachers of courses you're enrolled in and admins</p>
                    )}
                    {user?.role === 'teacher' && (
                      <p className="text-sm text-gray-400">You can only message students enrolled in your courses and admins</p>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="px-4 pt-2 text-sm text-gray-500">
                      {user?.role === 'student' && "You can message teachers of courses you're enrolled in and admins"}
                      {user?.role === 'teacher' && "You can message students enrolled in your courses and admins"}
                      {user?.role === 'admin' && "You can message all users"}
                    </p>
                    {filteredContacts.map(contact => {
                      if (!contact || !contact._id) return null;
                      
                      return (
                        <div 
                          key={contact._id} 
                          className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                          onClick={() => startNewConversation(contact)}
                        >
                          <div className={`w-12 h-12 rounded-full mr-4 flex items-center justify-center text-white ${getRoleBgColor(contact.role)}`}>
                            {getInitial(contact.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900">{contact.name}</h4>
                            <div className="flex items-center mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBgLightColor(contact.role)} ${getRoleTextColor(contact.role)}`}>
                                {contact.role || 'user'}
                              </span>
                              <span className="text-sm text-gray-500 ml-2 truncate">
                                {contact.email}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;