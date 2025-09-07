import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Chatbot from './chatbot';

interface ChatbotPopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function ChatbotPopover({ isOpen, onOpenChange, children }: ChatbotPopoverProps) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-120 h-[calc(100svh-12rem)] p-0">
        <Chatbot />
      </PopoverContent>
    </Popover>
  );
}

export default ChatbotPopover;
