import type { InfiniteData } from '@tanstack/react-query';
import type { UIMessage } from 'ai';
import type { ChatBotApiResponse, UIMessageMetadata } from './schemas';
import { useChat } from '@ai-sdk/react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { DefaultChatTransport } from 'ai';
import { useEffect, useMemo, useState } from 'react';
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
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ['chatbot-messages'],
    queryFn: ({ pageParam }) => getConversationPage({ limit: 8, cursor: pageParam as string | undefined }),
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
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
  const { messages, setMessages, sendMessage, status, regenerate } = useChat<UIMessage<UIMessageMetadata>>({
    transport: new DefaultChatTransport({ api: '/api/chatbot' }),
    onFinish: () => {
      // When a response finishes, pick the latest user/assistant messages
      const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
      const lastUser = [...messages].reverse().find(m => m.role === 'user');

      const getFullText = (m?: UIMessage): string => {
        if (!m)
          return '';
        // Messages may contain multiple streamed parts; stitch them into plain text
        return (m.parts ?? []).reduce((acc: string, part: any) => {
          if (part.type === 'text')
            return acc + (part.text ?? '');
          if (part.type === 'text-delta')
            return acc + (part.delta ?? '');
          return acc;
        }, '');
      };

      const assistantText = getFullText(lastAssistant);
      const userText = getFullText(lastUser);
      if (!assistantText && !userText)
        return;

      // Optimistically merge the finished user/assistant messages into the
      // first page of cached history to keep UI consistent across reloads.
      queryClient.setQueryData<InfiniteData<ChatBotApiResponse>>(
        ['chatbot-messages'],
        (prev) => {
          if (!prev || !prev.pages?.length)
            return prev;
          const pages = [...prev.pages];
          const first = { ...pages[0]! };
          const updated = [...first.messages];

          // Avoid accidental duplicates by checking the last two messages in history.
          // We compare by role + plain text, which is a pragmatic heuristic.
          const lastTwo = updated.slice(-2).map(m => `${m.role}:${(m.parts?.[0] as any)?.text ?? ''}`);
          const wantUser = userText && !lastTwo.includes(`user:${userText}`);
          const wantAssistant = assistantText && !lastTwo.includes(`assistant:${assistantText}`);

          if (wantUser) {
            updated.push({
              id: `local-user-${Date.now()}`,
              role: 'user',
              parts: [{ type: 'text', text: userText } as any],
              metadata: { createdAt: new Date(), updatedAt: new Date() },
            } as UIMessage<UIMessageMetadata>);
          }

          if (wantAssistant) {
            updated.push({
              id: `local-assistant-${Date.now()}`,
              role: 'assistant',
              parts: [{ type: 'text', text: assistantText } as any],
              metadata: { createdAt: new Date(), updatedAt: new Date() },
            } as UIMessage<UIMessageMetadata>);
          }

          // If nothing changed, return the previous cache to preserve referential equality.
          if (updated.length === first.messages.length)
            return prev;
          pages[0] = { ...first, messages: updated };
          return { ...prev, pages };
        },
      );
    },
  });

  /**
   * Merge fetched history into the local chat state.
   *
   * - `useChat` manages the live session (messages sent during this visit).
   * - `useInfiniteQuery` provides persisted history (older messages).
   *
   * 1. Collect all current message IDs from the live chat state.
   * 2. Filter out any history messages already in that set.
   * 3. Prepend the remaining history messages before the current session.
   */
  useEffect(() => {
    const getFullText = (m: UIMessage) => (m.parts ?? []).reduce((acc: string, part: any) => {
      if (part.type === 'text')
        return acc + (part.text ?? '');
      if (part.type === 'text-delta')
        return acc + (part.delta ?? '');
      return acc;
    }, '');

    // Build a simple de-duplication set using role+text. This guards against
    // rendering the same message twice when merging history with the live list.
    const existingKeys = new Set(messages.map(m => `${m.role}:${getFullText(m)}`));
    const toPrepend = seededHistory.filter(m => !existingKeys.has(`${m.role}:${getFullText(m)}`));
    if (toPrepend.length > 0)
      setMessages([...toPrepend, ...messages] as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seededHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim())
      return;

    sendMessage(
      { text: input },
      { body: { model } },
    );
    setInput('');
  };

  const handleRegenerate = () => {
    regenerate({ body: { model } });
  };

  return {
    input,
    setInput,
    model,
    setModel,
    query,
    seededHistory,
    messages,
    status,
    handleSubmit,
    handleRegenerate,
  } as const;
}
