import type { UIMessage } from 'ai';
import type { MessageDocument } from './models';
import type { ExpenseContext, ExpenseContextFormatted, MessageContext, MessageContextFormatted, UIMessageMetadata } from './schemas';

export function mapModelToDisplay(message: MessageDocument): UIMessage<UIMessageMetadata> {
  const obj = message.toObject ? message.toObject() : message;

  return {
    id: obj._id.toString(),
    parts: [{ type: 'text' as const, text: obj.content }],
    role: obj.role,
    metadata: {
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    },
  };
}

// Build formatted context strings
export function formatMessageContext(ctx: MessageContext): MessageContextFormatted {
  const content = ctx.content ?? '';
  const formatted = `(${ctx.role}) ${content.length > 200 ? `${content.slice(0, 200)}…` : content}`;
  return { ...ctx, formatted };
}

export function formatExpenseContext(ctx: ExpenseContext): ExpenseContextFormatted {
  const date = ctx.date ? new Date(ctx.date).toISOString().slice(0, 10) : '';
  const desc = (ctx.description ?? '').slice(0, 120);
  const qty = typeof ctx.quantity === 'number' ? `x${ctx.quantity}` : '';
  const price = typeof ctx.totalPrice === 'number' ? `$${ctx.totalPrice.toFixed(2)}` : '';
  const category = ctx.category ? `[${ctx.category}]` : '';
  const formatted = `${date} ${category} ${qty} ${price} – ${desc}`.trim();
  return { ...ctx, formatted };
}
