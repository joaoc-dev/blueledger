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
    id: 'openai/gpt-oss-120b',
    name: 'OpenAI GPT-OSS 120B',
  },
  {
    id: 'openai/gpt-oss-20b',
    name: 'OpenAI GPT-OSS 20B',
  },
] as const;

export type ChatbotModel = (typeof CHATBOT_MODELS)[number];

// Rate limits for chatbot POST requests
// Short window to prevent bursts; daily cap to prevent abuse
export const CHATBOT_POST_LIMIT_SHORT = { max: 7, windowSec: 30 };
export const CHATBOT_POST_LIMIT_DAILY = { max: 200, windowSec: 86400 };
