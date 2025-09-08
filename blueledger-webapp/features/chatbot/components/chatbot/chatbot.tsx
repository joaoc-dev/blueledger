'use client';

// (unused imports removed)
import { format } from 'date-fns';
import { Bot, Brain, Check, CopyIcon, RefreshCcwIcon } from 'lucide-react';
import React, { Fragment } from 'react';
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
import { CHATBOT_MODELS } from '@/features/chatbot/constants';
import { useChatbot } from '@/features/chatbot/hooks';

function ChatBot() {
  const chatbot = useChatbot(CHATBOT_MODELS[0]?.id || '');

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Conversation className="flex-1 min-h-0">
        <ConversationContent>
          {chatbot.query.isLoading && (
            <div className="flex justify-center my-2">
              <Loader />
            </div>
          )}
          {chatbot.query.hasNextPage && (
            <div className="flex justify-center mb-2">
              <Button variant="outline" size="sm" onClick={() => chatbot.query.fetchNextPage()} disabled={chatbot.query.isFetchingNextPage}>
                {chatbot.query.isFetchingNextPage ? 'Loading…' : 'Load previous'}
              </Button>
            </div>
          )}
          {chatbot.messages.map((message, messageIndex) => {
            const isLastMessage = messageIndex === chatbot.messages.length - 1;

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
                          {chatbot.messages.length > 1 && isLastMessage && message.role === 'assistant' && (
                            <Actions>
                              <Action onClick={() => chatbot.handleRegenerate()} label="Retry">
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
          {(chatbot.status === 'submitted' || chatbot.status === 'streaming') && <Loader />}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput onSubmit={chatbot.handleSubmit} className="mt-4 rounded-sm sticky bottom-0 bg-background">
        <PromptInputTextarea
          onChange={e => chatbot.setInput(e.target.value)}
          value={chatbot.input}
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
                    onClick={() => chatbot.setModel(modelOption.id)}
                    className="grid grid-cols-[auto_1fr] items-center justify-between"
                  >
                    {chatbot.model === modelOption.id
                      ? <Check className="w-4 h-4" />
                      : <div className="w-4 h-4" />}
                    <span>{modelOption.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </PromptInputTools>
          <PromptInputSubmit disabled={!chatbot.input} status={chatbot.status} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}

export default ChatBot;
