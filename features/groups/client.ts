import type { UserDisplay } from '../users/schemas';
import type {
  GroupFormData,
  GroupMembershipApiResponse,
  GroupMembershipDisplay,
  MembershipCheckApiResponse,
} from './schemas';
import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api-client';
import { mapApiResponseListToDisplay, mapApiResponseToDisplay } from './mapper-client';

const groupsEndpoint = '/groups';
const membershipsEndpoint = '/memberships';

export async function createGroup(data: GroupFormData): Promise<GroupMembershipDisplay> {
  const result = await apiPost<GroupMembershipApiResponse>(groupsEndpoint, data);
  return mapApiResponseToDisplay(result);
}

export async function updateGroup(
  groupId: string,
  data: GroupFormData,
): Promise<GroupMembershipDisplay> {
  const group = await apiPatch<GroupMembershipApiResponse>(`${groupsEndpoint}/${groupId}`, data);
  return mapApiResponseToDisplay(group);
}

export async function deleteGroup(groupId: string): Promise<void> {
  await apiDelete<GroupMembershipApiResponse>(`${groupsEndpoint}/${groupId}`);
}

export async function inviteToGroup(
  groupId: string,
  data: { email?: string; friendshipId?: string },
): Promise<{ success: boolean; membershipId?: string }> {
  const result = await apiPost<{ success: boolean; membershipId?: string }>(`${groupsEndpoint}/${groupId}/memberships`, data);
  return result;
}

export async function getMemberships(): Promise<GroupMembershipDisplay[]> {
  const memberships = await apiGet<GroupMembershipApiResponse[]>(membershipsEndpoint);
  return mapApiResponseListToDisplay(memberships);
}

export async function getGroupMemberships(groupId: string): Promise<GroupMembershipDisplay[]> {
  const memberships = await apiGet<GroupMembershipApiResponse[]>(`${groupsEndpoint}/${groupId}/memberships`);
  return mapApiResponseListToDisplay(memberships);
}

export async function acceptGroupMembership(
  groupId: string,
  membershipId: string,
): Promise<GroupMembershipDisplay> {
  const result = await apiPatch<GroupMembershipApiResponse>(`${groupsEndpoint}/${groupId}/memberships/${membershipId}/accept`);
  return mapApiResponseToDisplay(result);
}

export async function declineGroupInvite(
  groupId: string,
  membershipId: string,
): Promise<GroupMembershipDisplay> {
  const result = await apiPatch<GroupMembershipApiResponse>(`${groupsEndpoint}/${groupId}/memberships/${membershipId}/decline`);
  return mapApiResponseToDisplay(result);
}

export async function cancelGroupInvite(
  groupId: string,
  membershipId: string,
): Promise<GroupMembershipDisplay> {
  const result = await apiPatch<GroupMembershipApiResponse>(`${groupsEndpoint}/${groupId}/memberships/${membershipId}/cancel`);
  return mapApiResponseToDisplay(result);
}

export async function kickGroupMember(
  groupId: string,
  membershipId: string,
): Promise<GroupMembershipDisplay> {
  const result = await apiPatch<GroupMembershipApiResponse>(`${groupsEndpoint}/${groupId}/memberships/${membershipId}/kick`);
  return mapApiResponseToDisplay(result);
}

export async function leaveGroup(
  groupId: string,
  membershipId: string,
): Promise<GroupMembershipDisplay> {
  const result = await apiPatch<GroupMembershipApiResponse>(`${groupsEndpoint}/${groupId}/memberships/${membershipId}/leave`);
  return mapApiResponseToDisplay(result);
}

export async function getInviteableFriendsForGroup(groupId: string): Promise<UserDisplay[]> {
  const result = await apiGet<UserDisplay[]>(`${groupsEndpoint}/${groupId}/invitable-friends`);
  return result;
}

export async function checkMembershipByEmail(
  groupId: string,
  email: string,
): Promise<MembershipCheckApiResponse> {
  const result = await apiPost<MembershipCheckApiResponse>(
    `${groupsEndpoint}/${groupId}/memberships/check`,
    { email },
  );

  return result;
}
