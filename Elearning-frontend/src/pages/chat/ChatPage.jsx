import React from 'react';
import Chat from '../../components/chat/Chat';
import { ChatProvider } from '../../context/ChatContext';
// import Layout from '../../admin/Utils/Layout';

const ChatPage = () => {
  return (
    <div style={{ marginTop: '10%' }}>
      <div className="w-full mx-auto max-w-7xl mt-6 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Messages</h1>
        <div className="bg-white rounded-lg shadow">
          <ChatProvider>
            <Chat />
          </ChatProvider>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
