import React from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import Chatbot from './chatbot';

interface ChatbotSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

function ChatbotSheet({ isOpen, onClose }: ChatbotSheetProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="p-0 overflow-hidden h-[85svh] max-h-[85svh]">
        <div className="flex h-full min-h-0 flex-col pb-[env(safe-area-inset-bottom)]">
          <div className="px-4 py-3 border-b">
            <DrawerTitle>Chatbot</DrawerTitle>
          </div>
          <div className="flex-1 min-h-0">
            <Chatbot />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ChatbotSheet;
