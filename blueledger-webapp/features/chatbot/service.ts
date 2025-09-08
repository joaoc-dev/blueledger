import type { UIMessage } from 'ai';
import type { ChatbotModel } from './constants';
import type { RequestLogger } from '@/lib/logger';
import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';
import { convertToModelMessages, embed, streamText } from 'ai';
import { Types } from 'mongoose';
import dbConnect from '@/lib/db/mongoose-client';
import { saveMessage } from './data';
import { mapModelToDisplay } from './mapper-server';
import Message from './models';

// RECALL_TOP_K controls how many similar historical snippets are retrieved
// SLIDING_WINDOW_SIZE limits how many of the most recent messages will be used
const RECALL_TOP_K = 3;
const SLIDING_WINDOW_SIZE = 10;

/**
 * System configuration for the assistant.
 * Defines tone, purpose, and reasoning style.
 */
// System prompt guiding Blue's behavior and response style.
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
Remember your purpose is to help the user with their expenses, 
don't be verbose or answer unrelated questions and requests unless the answer is part of the provided context.

Always be transparent about your analysis process.`;

/**
 * Generate an AI response stream for the given messages and model.
 */
// Stream a model response for the current UI messages, with a small token cap.
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
// Save the latest user message (on submit) and persist its embedding for later vector recall.
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

  const embedding = await generateEmbedding(content);

  await saveMessage({
    data: {
      content,
      role: latestMessage.role,
      user: userId,
      embedding,
    },
  });
}

/**
 * Persist or update the assistant's generated response.
 *
 * - On regenerate: updates the latest assistant message if it exists, otherwise creates a new one.
 * - On submit: always creates a new assistant message.
 */
// Save or update the assistant message and store its embedding so recall can include summaries/explanations.
async function persistAssistantMessage(
  userId: string,
  collected: string,
  trigger: 'submit-message' | 'regenerate-message',
) {
  if (!collected.trim())
    return;

  // Embed the final concatenated assistant output once the stream completes.
  const embedding = await generateEmbedding(collected);
  await dbConnect();

  if (trigger === 'regenerate-message') {
    const query = { user: userId, role: 'assistant' as const };

    // Sorting by createdAt ensures we always target the latest assistant message.
    const updated = await Message.findOneAndUpdate(
      query,
      { content: collected, embedding },
      { sort: { createdAt: -1 } },
    );

    if (!updated) {
      await saveMessage({
        data: { content: collected, role: 'assistant', user: userId, embedding },
      });
    }
  }
  else {
    await saveMessage({
      data: { content: collected, role: 'assistant', user: userId, embedding },
    });
  }
}

// Determine the latest user-authored text to use as the query for recall.
function getLatestUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const m = messages[i];
    if (m?.role === 'user') {
      const text = (m.parts ?? [])
        .map(p => (p.type === 'text' ? p.text : ''))
        .join('');
      if (text.trim())
        return text;
    }
  }
  return '';
}

// Build a context-enhanced message list by prepending vector-recall snippets
// and applying a sliding window over the recent conversation.
async function buildContextMessages(
  messages: UIMessage[],
  userId: string,
  logger: RequestLogger,
  topK: number = RECALL_TOP_K,
  windowSize: number = SLIDING_WINDOW_SIZE,
): Promise<UIMessage[]> {
  // Apply sliding window over the raw messages first.
  const windowed = windowSize > 0 ? messages.slice(-windowSize) : messages;

  const latestText = getLatestUserText(windowed);
  if (!latestText)
    return windowed;

  const similar = await findSimilarMessages(userId, latestText, topK, logger);
  if (!similar || similar.length === 0)
    return windowed;

  const contextLines = similar.map((m) => {
    const content = (m.parts ?? [])
      .map(p => (p.type === 'text' ? p.text : ''))
      .join('');
    return `(${m.role}) ${content.length > 200 ? `${content.slice(0, 200)}…` : content}`;
  });

  const contextHeader: UIMessage = {
    id: 'recall',
    role: 'system',
    parts: [{ type: 'text', text: 'Relevant prior conversation snippets:' }] as any,
  } as UIMessage;

  const contextBody: UIMessage = {
    id: 'recall-context',
    role: 'system',
    parts: [{ type: 'text', text: contextLines.join('\n') }] as any,
  } as UIMessage;

  return [contextHeader, contextBody, ...windowed];
}

/**
 * Prepare context (sliding window + vector recall), update history, and stream a response.
 *
 * Behavior:
 * - Applies a sliding window over the last N messages, then prepends vector-recalled snippets
 *   based on the latest user message (works for both submit and regenerate).
 * - Persists the latest user message and its embedding only on `submit-message`.
 * - Persists assistant output for both triggers. On `regenerate-message`, updates the latest
 *   assistant message when present; otherwise creates a new one.
 *
 * @param messages - Current conversation in UIMessage format.
 * @param model - Chatbot model configuration or ID.
 * @param userId - The ID of the user in this conversation.
 * @param trigger - `submit-message` for new user input, or `regenerate-message` for retrying the last assistant reply.
 * @param logger - Logger used for tracing and vector search warnings.
 * @returns Promise resolving to a streaming Response for the UI.
 */
export async function updateHistoryAndGenerateResponse(
  messages: UIMessage[],
  model: ChatbotModel | string,
  userId: string,
  trigger: 'submit-message' | 'regenerate-message',
  logger: RequestLogger,
): Promise<Response> {
  // Persist user messages only on "submit"
  if (trigger === 'submit-message') {
    void persistUserMessage(messages, userId);
  }

  // Always apply recall + sliding window for both submit and regenerate
  const preparedMessages = await buildContextMessages(messages, userId, logger);

  const modelId = typeof model === 'string' ? model : model.id;
  const result = generateResponse(preparedMessages, modelId);

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

/**
 * Generate a vector embedding for the given text.
 *
 * Used to store embeddings for messages and to perform vector similarity search.
 * Currently uses Gemini's embedding model.
 */
async function generateEmbedding(value: string) {
  const embeddingModel = google.textEmbeddingModel('gemini-embedding-001');
  const response = await embed({ model: embeddingModel, value });
  return response.embedding ?? [];
}

// Vector search for the most similar messages by the same user.
// Requires an Atlas Search index named 'message_embedding_index' on field 'embedding'.
async function findSimilarMessages(
  userId: string,
  query: string,
  k: number = 3,
  logger: RequestLogger,
): Promise<UIMessage[]> {
  await dbConnect();

  const queryVector = await generateEmbedding(query);

  try {
    const results = await (Message as any).aggregate([
      {
        $vectorSearch: {
          index: 'message_embedding_index',
          path: 'embedding',
          queryVector,
          numCandidates: 500,
          limit: k,
          filter: {
            user: Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId,
          },
        },
      },
      {
        $project: {
          content: 1,
          role: 1,
          createdAt: 1,
          updatedAt: 1,
          _id: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
      { $limit: k },
    ]).exec();

    return results.map(mapModelToDisplay);
  }
  catch (error) {
    logger.warn('Vector search failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}
