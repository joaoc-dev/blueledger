import type { UIMessage } from 'ai';
import type { ChatbotRole } from './constants';
import type { MessageDocument } from './models';
import type { UIMessageMetadata } from './schemas';

// Define a minimal shape to be used for plain aggregation results
interface ProjectedMessage {
  _id: { toString: () => string } | string;
  content: string;
  role: ChatbotRole;
  createdAt: Date;
  updatedAt: Date;
  toObject?: () => ProjectedMessage;
}

export function mapModelToDisplay(message: MessageDocument | ProjectedMessage): UIMessage<UIMessageMetadata> {
  const obj = (message as any).toObject ? (message as any).toObject() : message;

  return {
    id: (obj._id as any).toString(),
    parts: [{ type: 'text' as const, text: obj.content }],
    role: obj.role,
    metadata: {
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    },
  };
}
