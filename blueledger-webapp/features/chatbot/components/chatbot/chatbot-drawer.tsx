import React from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import Chatbot from './chatbot';

interface ChatbotSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

function ChatbotSheet({ isOpen, onClose }: ChatbotSheetProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[calc(100svh)]">
        <Chatbot />
      </DrawerContent>
    </Drawer>
  );
}

export default ChatbotSheet;
