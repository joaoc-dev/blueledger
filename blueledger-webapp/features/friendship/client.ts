import type { FriendshipApiResponse, FriendshipDisplay } from './schemas';
import { apiGet, apiPatch, apiPost } from '@/lib/api-client';
import { mapApiResponseListToDisplay } from './mapper-client';

const endpoint = '/friendships';

export async function getFriends(): Promise<FriendshipDisplay[]> {
  const response = await apiGet<FriendshipApiResponse[]>(endpoint);
  return mapApiResponseListToDisplay(response);
}

export async function sendFriendRequest(email: string): Promise<void> {
  return await apiPost<void>(`${endpoint}/request`, { email });
}

export async function acceptFriendRequest(friendshipId: string): Promise<void> {
  return await apiPatch<void>(`${endpoint}/accept/${friendshipId}`);
}

export async function declineFriendRequest(friendshipId: string): Promise<void> {
  return await apiPatch<void>(`${endpoint}/decline/${friendshipId}`);
}

export async function cancelFriendRequest(friendshipId: string): Promise<void> {
  return await apiPatch<void>(`${endpoint}/cancel/${friendshipId}`);
}
