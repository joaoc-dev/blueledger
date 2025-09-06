import Modal from '@/components/shared/modal';
import Chatbot from './chatbot';

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Chat with Blue"
      goBackOnClose={false}
    >
      <Chatbot />
    </Modal>
  );
}

export default ChatbotModal;
