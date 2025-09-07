import type { UIMessage } from 'ai';
import type { MessageDocument } from './models';
import type { ChatBotApiResponse, CreateMessageData } from './schemas';
import dbConnect from '@/lib/db/mongoose-client';
import { CHATBOT_ROLES } from './constants';
import { mapModelToDisplay } from './mapper-server';
import Message from './models';

/**
 * Save a new chat message into the database and return it in UI-ready format.
 *
 * @param message - The message data coming from the client.
 * @returns The saved message, formatted for UI consumption.
 */
export async function saveMessage(
  message: CreateMessageData,
): Promise<UIMessage> {
  await dbConnect();

  const messageModel: Partial<MessageDocument> = {
    ...message.data,
  };

  const newMessage = await Message.create(messageModel);

  return mapModelToDisplay(newMessage);
}

/**
 * Create and store a greeting message for a user.
 *
 * @param userId - The ID of the user receiving the greeting.
 * @returns The created greeting message document.
 */
async function createGreetingMessage(userId: string): Promise<MessageDocument> {
  return Message.create({
    content:
      'Hey! I\'m Blue, your own personal assistant. I can help you with your expenses, budgeting, and financial insights. How can I assist you today?',
    role: CHATBOT_ROLES.ASSISTANT,
    user: userId,
    conversationId: `greeting-${userId}-${Date.now()}`,
  });
}

/**
 * Fetch a user's conversation history with pagination support.
 *
 * @param userId - The ID of the user whose conversation history is being fetched.
 * @param limit - Maximum number of messages to return per page. Defaults to 20.
 * @param cursor - Optional timestamp string (ISO date). If provided, fetches messages created before this date.
 * @returns A paginated response containing messages and a cursor for the next page.
 */
export async function getConversationHistory(
  userId: string,
  limit: number = 20,
  cursor?: string,
): Promise<ChatBotApiResponse> {
  await dbConnect();

  const query: Record<string, unknown> = { user: userId };

  if (cursor) {
    query.createdAt = { $lt: new Date(cursor) };
  }

  // Fetch one extra message to check if more pages exist
  const docs = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .exec();

  let chronological: MessageDocument[] = [];
  let hasMore = false;

  // If first page and no messages exist, create an initial greeting message
  if (!cursor && docs.length === 0) {
    const greetingMessage = await createGreetingMessage(userId);
    chronological = [greetingMessage];
    hasMore = false;
  }
  else {
    hasMore = docs.length > limit;

    const sliced = hasMore ? docs.slice(0, limit) : docs;

    // Reverse to chronological order (oldest first)
    chronological = sliced.reverse();
  }

  const nextCursor
    = hasMore && chronological.length > 0
      ? chronological[0]!.createdAt.toISOString()
      : null;

  return {
    messages: chronological.map(mapModelToDisplay),
    nextCursor,
  };
}
