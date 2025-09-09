import type { UIMessage } from 'ai';
import { Types } from 'mongoose';
import { z } from 'zod';
import { CHATBOT_ROLES_VALUES } from './constants';

const roleSchema = z.enum(CHATBOT_ROLES_VALUES);

const contentSchema = z
  .string()
  .trim()
  .min(1, { message: 'Content is required' })
  .max(10000, { message: 'Content must be less than 10000 characters' });

const _createMessageSchema = z.strictObject({
  data: z.strictObject({
    content: contentSchema,
    role: roleSchema,
    user: z.string().refine(Types.ObjectId.isValid, { message: 'Invalid ID' }),
    embedding: z.array(z.number()).optional(),
  }),
});

export type CreateMessageData = z.infer<typeof _createMessageSchema>;

const _UIMessageMetadataSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UIMessageMetadata = z.infer<typeof _UIMessageMetadataSchema>;

export interface ChatBotApiResponse {
  messages: UIMessage<UIMessageMetadata>[];
  nextCursor: string | null;
}

// Context item returned from vector recall for messages
const MessageContextSchema = z.object({
  id: z.string(),
  content: contentSchema,
  role: roleSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type MessageContext = z.infer<typeof MessageContextSchema>;

// Context item returned from vector recall for expenses
const ExpenseContextSchema = z.object({
  id: z.string(),
  description: z.string().min(1),
  date: z.date(),
  category: z.string(),
  price: z.number(),
  quantity: z.number(),
  totalPrice: z.number(),
});

export type ExpenseContext = z.infer<typeof ExpenseContextSchema>;

// Pre-formatted context variants used directly in prompts
const _MessageContextFormattedSchema = MessageContextSchema.extend({
  formatted: z.string(),
});
export type MessageContextFormatted = z.infer<typeof _MessageContextFormattedSchema>;

const _ExpenseContextFormattedSchema = ExpenseContextSchema.extend({
  formatted: z.string(),
});
export type ExpenseContextFormatted = z.infer<typeof _ExpenseContextFormattedSchema>;
