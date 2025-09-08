'use client';
import type { ChatbotController } from '@/features/chatbot/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { chatbotKeys } from '@/constants/query-keys';
import Chatbot from './chatbot';

interface ChatbotPopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  controller?: ChatbotController;
}

function ChatbotPopover({ isOpen, onOpenChange, children, controller }: ChatbotPopoverProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen)
      queryClient.invalidateQueries({ queryKey: chatbotKeys.messages });
  }, [isOpen, queryClient]);

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-120 h-[calc(100svh-12rem)] p-0">
        {controller && <Chatbot controller={controller} />}
      </PopoverContent>
    </Popover>
  );
}

export default ChatbotPopover;
