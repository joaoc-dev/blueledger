'use client';

import type { UIMessage } from 'ai';
import type { UIMessageMetadata } from '@/features/chatbot/schemas';
import { useChat } from '@ai-sdk/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { DefaultChatTransport } from 'ai';
import { format } from 'date-fns';
import { Bot, Brain, Check, CopyIcon, RefreshCcwIcon } from 'lucide-react';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Action, Actions } from '@/components/ai-elements/actions';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Loader } from '@/components/ai-elements/loader';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import { Response } from '@/components/ai-elements/response';
import { Button } from '@/components/ui-modified/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getConversationPage } from '@/features/chatbot/client';
import { CHATBOT_MODELS } from '@/features/chatbot/constants';

function ChatBot() {
  const [input, setInput] = useState('');
  const [model, setModel] = useState<string>(CHATBOT_MODELS[0]?.id || '');

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['chatbot-messages'],
    queryFn: ({ pageParam }) => getConversationPage({ limit: 8, cursor: pageParam as string | undefined }),
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    // Ensure we always fetch fresh history when the chat opens
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
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
    const pages = data?.pages ?? [];
    const orderedPages = [...pages].reverse();
    const flat = orderedPages.flatMap(p => p.messages);

    return flat;
  }, [data]);

  const { messages, setMessages, sendMessage, status, regenerate } = useChat<UIMessage<UIMessageMetadata>>({
    transport: new DefaultChatTransport({
      api: '/api/chatbot',
    }),
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
    const existingIds = new Set(messages.map(m => m.id));
    const toPrepend = seededHistory.filter(m => !existingIds.has(m.id));
    if (toPrepend.length > 0) {
      setMessages([...toPrepend, ...messages] as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seededHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(
        { text: input },
        {
          body: {
            model,
          },
        },
      );
      setInput('');
    }
  };

  const handleRegenerate = () => {
    regenerate({
      body: {
        model,
      },
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Conversation className="flex-1 min-h-0">
        <ConversationContent>
          {isLoading && (
            <div className="flex justify-center my-2">
              <Loader />
            </div>
          )}
          {hasNextPage && (
            <div className="flex justify-center mb-2">
              <Button variant="outline" size="sm" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? 'Loading…' : 'Load previous'}
              </Button>
            </div>
          )}
          {messages.map((message, messageIndex) => {
            const isLastMessage = messageIndex === messages.length - 1;

            return (
              <Fragment key={message.id}>
                {message.parts.map((part: any, _i: number) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <div key={message.id}>
                          <Message from={message.role} className="relative">
                            {message.role === 'assistant' && (
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center absolute top-[-5] left-[-5]">
                                <Bot className="w-5 h-5 text-white" />
                              </div>
                            )}
                            <MessageContent>
                              <Response>
                                {part.text}
                              </Response>
                              <div className={`text-xs text-foreground/60 mt-2 
                                  ${message.role === 'user' ? 'text-right text-slate-700' : ''}`}
                              >
                                {format(message.metadata?.createdAt || new Date(), 'p')}
                              </div>
                            </MessageContent>
                          </Message>
                          {messages.length > 1 && isLastMessage && message.role === 'assistant' && (
                            <Actions>
                              <Action onClick={() => handleRegenerate()} label="Retry">
                                <RefreshCcwIcon className="size-3" />
                              </Action>
                              <Action onClick={() => navigator.clipboard.writeText(part.text)} label="Copy">
                                <CopyIcon className="size-3" />
                              </Action>
                            </Actions>
                          )}
                        </div>
                      );
                    default:
                      return null;
                  }
                })}

              </Fragment>
            );
          })}
          {status === 'submitted' && <Loader />}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput onSubmit={handleSubmit} className="mt-4 rounded-sm sticky bottom-0 bg-background">
        <PromptInputTextarea
          onChange={e => setInput(e.target.value)}
          value={input}
          className="!outline-none !border-none !ring-0 !focus-visible:ring-0 !focus-visible:outline-none"
        />
        <PromptInputToolbar>
          <PromptInputTools>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 rounded-lg !rounded-bl-lg">
                  <Brain className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start">
                {CHATBOT_MODELS.map(modelOption => (
                  <DropdownMenuItem
                    key={modelOption.id}
                    onClick={() => setModel(modelOption.id)}
                    className="grid grid-cols-[auto_1fr] items-center justify-between"
                  >
                    {model === modelOption.id
                      ? <Check className="w-4 h-4" />
                      : <div className="w-4 h-4" />}
                    <span>{modelOption.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </PromptInputTools>
          <PromptInputSubmit disabled={!input} status={status} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}

export default ChatBot;
