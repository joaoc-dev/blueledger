import type { UIMessage } from 'ai';
import type { MessageDocument } from './models';
import type { UIMessageMetadata } from './schemas';

export function mapModelToDisplay(message: MessageDocument): UIMessage<UIMessageMetadata> {
  const obj = message.toObject ? message.toObject() : message;

  return {
    id: obj.conversationId ?? obj._id.toString(),
    parts: [{ type: 'text' as const, text: obj.content }],
    role: obj.role,
    metadata: {
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    },
  };
}
