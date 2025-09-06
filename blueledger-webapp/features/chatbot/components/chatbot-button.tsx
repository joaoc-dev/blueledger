import { Bot } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui-modified/button';

interface ChatbotButtonProps {
  onClick: () => void;
}

function ChatbotButton({ onClick }: ChatbotButtonProps) {
  return (
    <Button className="h-12 w-12 rounded-full text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95" onClick={onClick}>
      <Bot className="size-7 transition-transform duration-200 group-hover:scale-105" />
    </Button>
  );
}

export default ChatbotButton;
