'use client';

import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import ChatbotButton from './chatbot-button';
import ChatbotDrawer from './chatbot/chatbot-drawer';
import ChatbotModal from './chatbot/chatbot-modal';

function ChatbotContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 group">
        <ChatbotButton onClick={handleClick} />
      </div>
      {isMobile
        ? <ChatbotDrawer isOpen={isOpen} onClose={handleClose} />
        : <ChatbotModal isOpen={isOpen} onClose={handleClose} />}
    </>
  );
}

export default ChatbotContainer;
