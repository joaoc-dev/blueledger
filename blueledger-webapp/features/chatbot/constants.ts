export const CHATBOT_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
} as const;

export const CHATBOT_ROLES_VALUES = [
  CHATBOT_ROLES.USER,
  CHATBOT_ROLES.ASSISTANT,
  CHATBOT_ROLES.SYSTEM,
] as const;

export type ChatbotRole = (typeof CHATBOT_ROLES_VALUES)[number];

export const CHATBOT_MODELS = [
  {
    id: 'openai/gpt-oss-20b',
    name: 'OpenAI GPT-OSS 20B',
  },
  {
    id: 'openai/gpt-oss-120b',
    name: 'OpenAI GPT-OSS 120B',
  },
] as const;

export type ChatbotModel = (typeof CHATBOT_MODELS)[number];
