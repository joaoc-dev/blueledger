'use client';

import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import ChatbotButton from './chatbot-button';
import ChatbotDrawer from './chatbot/chatbot-drawer';
import ChatbotPopover from './chatbot/chatbot-popover';

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
        {isMobile
          ? (
              <ChatbotButton onClick={handleClick} />
            )
          : (
              <ChatbotPopover
                isOpen={isOpen}
                onOpenChange={open => (open ? setIsOpen(true) : handleClose())}
              >
                <div>
                  <ChatbotButton />
                </div>
              </ChatbotPopover>
            )}
      </div>
      {isMobile && <ChatbotDrawer isOpen={isOpen} onClose={handleClose} />}
    </>
  );
}

export default ChatbotContainer;
