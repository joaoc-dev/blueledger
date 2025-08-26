import type { FriendshipApiResponse, FriendshipDisplay } from './schemas';
import { apiGet, apiPatch, apiPost } from '@/lib/api-client';
import { mapApiResponseListToDisplay } from './mapper-client';

const endpoint = '/friendships';

export async function getFriendships(): Promise<FriendshipDisplay[]> {
  const response = await apiGet<FriendshipApiResponse[]>(endpoint);
  return mapApiResponseListToDisplay(response);
}

export async function sendFriendshipInvite(email: string): Promise<FriendshipDisplay> {
  return await apiPost<FriendshipDisplay>(`${endpoint}/invite`, { email });
}

export async function acceptFriendshipInvite(friendshipId: string): Promise<void> {
  return await apiPatch<void>(`${endpoint}/${friendshipId}/accept`);
}

export async function declineFriendshipInvite(friendshipId: string): Promise<void> {
  return await apiPatch<void>(`${endpoint}/${friendshipId}/decline`);
}

export async function cancelFriendshipInvite(friendshipId: string): Promise<void> {
  return await apiPatch<void>(`${endpoint}/${friendshipId}/cancel`);
}
