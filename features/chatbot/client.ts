import type { ChatBotApiResponse } from './schemas';
import { apiGet } from '@/lib/api-client';

export async function getConversationPage(
  params?: { limit?: number; cursor?: string },
): Promise<ChatBotApiResponse> {
  const query = new URLSearchParams();
  if (params?.limit)
    query.set('limit', String(params.limit));
  if (params?.cursor)
    query.set('cursor', params.cursor);

  const response = await apiGet<ChatBotApiResponse>(`/chatbot${query.toString() ? `?${query.toString()}` : ''}`);
  return response;
}
