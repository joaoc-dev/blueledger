import type { UIMessage } from 'ai';
import type { UIMessageMetadata } from './schemas';
import { useChat } from '@ai-sdk/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { DefaultChatTransport } from 'ai';
import { useMemo, useState } from 'react';
import { chatbotKeys } from '@/constants/query-keys';
import { getConversationPage } from './client';

/**
 * Chatbot hook that merges persisted, paginated conversation history
 * (fetched via React Query) with an in-memory live chat session
 * (managed by the Vercel AI SDK).
 *
 * Responsibilities:
 * - Fetch older messages page-by-page and present them in chronological order.
 * - Stream new assistant responses and maintain the current session locally.
 * - Optimistically reflect newly finished exchanges into the cached history.
 * - Perform lightweight de-duplication between live and persisted messages.
 */
/**
 * useChatbot
 * @param modelDefaultId - Initial model identifier to use for completions.
 * @returns State and helpers for rendering a chatbot UI and handling I/O.
 */
export function useChatbot(modelDefaultId: string) {
  const [input, setInput] = useState('');
  const [model, setModel] = useState<string>(modelDefaultId);
  const [fallbackMessages, setFallbackMessages]
    = useState<UIMessage<UIMessageMetadata>[]>([]);

  const query = useInfiniteQuery({
    queryKey: chatbotKeys.messages,
    queryFn: ({ pageParam }) => getConversationPage({ limit: 8, cursor: pageParam as string | undefined }),
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    refetchOnMount: true,
  });

  /**
   * Combine and order paginated messages into a flat list for rendering.
   *
   * Why reverse?
   * Example:
   *   Pages (from API, newest → oldest):
   *     Page 1: [Msg 12, Msg 11, Msg 10]
   *     Page 2: [Msg 9, Msg 8, Msg 7]
   *     Page 3: [Msg 6, Msg 5, Msg 4]
   *     Page 4: [Msg 3, Msg 2, Msg 1]
   *
   *   After reverse() → [Page 4, Page 3, Page 2, Page 1]
   *   After flatMap()  → [Msg 1, Msg 2, Msg 3, ..., Msg 12]
   */
  const seededHistory: UIMessage<UIMessageMetadata>[] = useMemo(() => {
    const pages = query.data?.pages ?? [];
    const orderedPages = [...pages].reverse();
    return orderedPages.flatMap(p => p.messages);
  }, [query.data]);

  // Live chat session: handles streaming assistant responses and local message list
  const { messages, sendMessage, status, regenerate } = useChat<UIMessage<UIMessageMetadata>>({
    transport: new DefaultChatTransport({ api: '/api/chatbot' }),
    onError: () => {
      const apology = 'Sorry! Seems like I\'ve reached my limits :( Please come back later!';
      setFallbackMessages(prev => ([
        ...prev,
        {
          id: `${Date.now()}`,
          role: 'assistant',
          parts: [{ type: 'text', text: apology }] as any,
          metadata: { createdAt: Date.now() } as any,
        } as UIMessage<UIMessageMetadata>,
      ]));
    },
  });

  // Render-only combination of persisted history and current live session
  const combinedMessages: UIMessage<UIMessageMetadata>[] = useMemo(() => {
    const getFullText = (m: UIMessage) => (m.parts ?? []).reduce((acc: string, part: any) => {
      if (part.type === 'text')
        return acc + (part.text ?? '');
      if (part.type === 'text-delta')
        return acc + (part.delta ?? '');
      return acc;
    }, '');

    const seededKeys = new Set(seededHistory.map(m => `${m.role}:${getFullText(m)}`));
    const liveOnly = messages.filter(m => !seededKeys.has(`${m.role}:${getFullText(m as any)}`));
    return [...seededHistory, ...liveOnly, ...fallbackMessages] as UIMessage<UIMessageMetadata>[];
  }, [seededHistory, messages, fallbackMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim())
      return;

    setFallbackMessages([]);
    sendMessage(
      { text: input },
      { body: { model } },
    );
    setInput('');
  };

  const handleRegenerate = () => {
    setFallbackMessages([]);
    regenerate({ body: { model } });
  };

  return {
    input,
    setInput,
    model,
    setModel,
    query,
    seededHistory,
    messages: combinedMessages,
    status,
    handleSubmit,
    handleRegenerate,
  } as const;
}

export type ChatbotController = ReturnType<typeof useChatbot>;
