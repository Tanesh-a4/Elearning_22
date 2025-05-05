import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaComment } from 'react-icons/fa';
import './ChatButton.css';

const ChatButton = ({ unreadCount = 0 }) => {
  const navigate = useNavigate();
  
  const handleChatClick = (e) => {
    e.preventDefault(); // Prevent any default behavior
    navigate('/chat');
  };

  return (
    <button 
      className="floating-chat-button"
      onClick={handleChatClick}
      aria-label="Open messages"
      type="button" // Explicitly set button type
    >
      <FaComment />
      {unreadCount > 0 && (
        <span className="unread-badge">{unreadCount}</span>
      )}
    </button>
  );
};

export default ChatButton;