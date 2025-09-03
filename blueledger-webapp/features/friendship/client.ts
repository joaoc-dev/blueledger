import type { FriendshipApiResponse, FriendshipDisplay } from './schemas';
import { apiGet, apiPatch, apiPost } from '@/lib/api-client';
import { mapApiResponseListToDisplay, mapApiResponseToDisplay } from './mapper-client';

const endpoint = '/friendships';

export async function getFriendships(): Promise<FriendshipDisplay[]> {
  const response = await apiGet<FriendshipApiResponse[]>(endpoint);
  return mapApiResponseListToDisplay(response);
}

export async function sendFriendshipInvite(email: string): Promise<FriendshipDisplay> {
  const response = await apiPost<FriendshipApiResponse>(`${endpoint}/invite`, { email });
  return mapApiResponseToDisplay(response);
}

export async function acceptFriendshipInvite(friendshipId: string): Promise<FriendshipDisplay> {
  const response = await apiPatch<FriendshipApiResponse>(`${endpoint}/${friendshipId}/accept`);
  return mapApiResponseToDisplay(response);
}

export async function declineFriendshipInvite(friendshipId: string): Promise<FriendshipDisplay> {
  const response = await apiPatch<FriendshipApiResponse>(`${endpoint}/${friendshipId}/decline`);
  return mapApiResponseToDisplay(response);
}

export async function cancelFriendshipInvite(friendshipId: string): Promise<FriendshipDisplay> {
  const response = await apiPatch<FriendshipApiResponse>(`${endpoint}/${friendshipId}/cancel`);
  return mapApiResponseToDisplay(response);
}

export async function removeFriendship(friendshipId: string): Promise<FriendshipDisplay> {
  const response = await apiPatch<FriendshipApiResponse>(`${endpoint}/${friendshipId}/remove`);
  return mapApiResponseToDisplay(response);
}
