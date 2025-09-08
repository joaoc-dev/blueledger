'use client';
import type { ChatbotController } from '@/features/chatbot/hooks';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { chatbotKeys } from '@/constants/query-keys';
import Chatbot from './chatbot';

interface ChatbotSheetProps {
  isOpen: boolean;
  onClose: () => void;
  controller?: ChatbotController;
}

function ChatbotSheet({ isOpen, onClose, controller }: ChatbotSheetProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen)
      queryClient.invalidateQueries({ queryKey: chatbotKeys.messages });
  }, [isOpen, queryClient]);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="p-0 overflow-hidden h-[85svh] max-h-[85svh]">
        <div className="flex h-full min-h-0 flex-col pb-[env(safe-area-inset-bottom)]">
          <div className="px-4 py-3 border-b">
            <DrawerTitle>Chatbot</DrawerTitle>
          </div>
          <div className="flex-1 min-h-0">
            {controller && <Chatbot controller={controller} />}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ChatbotSheet;
