import type { UIMessage } from 'ai';
import type { ChatbotModel } from './constants';
import { groq } from '@ai-sdk/groq';
import { convertToModelMessages, streamText } from 'ai';
import dbConnect from '@/lib/db/mongoose-client';
import { saveMessage } from './data';
import Message from './models';

/**
 * System configuration for the assistant.
 * Defines tone, purpose, and reasoning style.
 */
const systemConfiguration = `Your name is Blue, an AI assistant for BlueLedger an expense tracker app.

When analyzing expenses, show your reasoning step by step:
1. First, acknowledge the user's expense question
2. Analyze their spending patterns based on the conversation
3. Provide specific calculations or insights
4. Give actionable recommendations
5. Answer concisely, prioritizing key points. 
6. Focus on clarity and reasoning.
7. Try to keep the response short but complete.
8. Never give very long responses.

Be light-hearted, witty, warm and friendly. 
Remember your purpose is to help the user with their expenses, don't be verbose or answer unrelated questions and requests.

If the user asks anything off-topic, respond with your purpose.

Always be transparent about your analysis process.`;

/**
 * Generate an AI response stream for the given messages and model.
 */
function generateResponse(messages: UIMessage[], modelId: string) {
  return streamText({
    model: groq(modelId),
    system: systemConfiguration,
    messages: convertToModelMessages(messages),
    maxOutputTokens: 500,
  });
}

/**
 * Persist the latest user message to the database (if valid).
 */
async function persistUserMessage(messages: UIMessage[], userId: string) {
  if (messages.length === 0)
    return;

  const latestMessage = messages[messages.length - 1];
  if (!latestMessage || latestMessage.role !== 'user')
    return;

  const content = latestMessage.parts
    .map(part => (part.type === 'text' ? part.text : ''))
    .join('');

  if (!content.trim())
    return;

  await saveMessage({
    data: {
      content,
      role: latestMessage.role,
      user: userId,
    },
  });
}

/**
 * Persist or update the assistant's generated response.
 *
 * - On regenerate: updates the latest assistant message if it exists, otherwise creates a new one.
 * - On submit: always creates a new assistant message.
 */
async function persistAssistantMessage(
  userId: string,
  collected: string,
  trigger: 'submit-message' | 'regenerate-message',
) {
  if (!collected.trim())
    return;

  await dbConnect();

  if (trigger === 'regenerate-message') {
    const query = { user: userId, role: 'assistant' as const };

    const updated = await Message.findOneAndUpdate(
      query,
      { content: collected },
      { sort: { createdAt: -1 } },
    );

    if (!updated) {
      await saveMessage({
        data: { content: collected, role: 'assistant', user: userId },
      });
    }
  }
  else {
    await saveMessage({
      data: { content: collected, role: 'assistant', user: userId },
    });
  }
}

/**
 * Update conversation history and generate an AI response stream.
 *
 * @param messages - The current conversation history in UIMessage format.
 * @param model - Chatbot model configuration or ID.
 * @param userId - The ID of the user in this conversation.
 * @param trigger - Whether this is a new message (`submit-message`) or a regeneration (`regenerate-message`).
 * @returns A streaming response that can be sent directly to the client.
 */
export function updateHistoryAndGenerateResponse(
  messages: UIMessage[],
  model: ChatbotModel | string,
  userId: string,
  trigger: 'submit-message' | 'regenerate-message',
): Response {
  // Persist user messages only on "submit"
  if (trigger === 'submit-message') {
    void persistUserMessage(messages, userId);
  }

  const modelId = typeof model === 'string' ? model : model.id;
  const result = generateResponse(messages, modelId);

  // Collect and persist assistant response
  void (async () => {
    try {
      let collected = '';
      for await (const delta of result.textStream) {
        collected += delta;
      }

      await persistAssistantMessage(userId, collected, trigger);
    }
    catch {
      // swallow errors — optionally log to monitoring system
    }
  })();

  return result.toUIMessageStreamResponse({
    messageMetadata: ({ part }) => {
      if (part.type === 'start') {
        return { createdAt: Date.now() };
      }
      return {};
    },
  });
}
