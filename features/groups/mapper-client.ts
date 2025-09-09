import type {
  GroupMembershipApiResponse,
  GroupMembershipDisplay,
} from './schemas';

export function mapApiResponseToDisplay(
  apiResponse: GroupMembershipApiResponse,
): GroupMembershipDisplay {
  return {
    ...apiResponse,
    createdAt: new Date(apiResponse.createdAt),
    updatedAt: new Date(apiResponse.updatedAt),
    acceptedAt: apiResponse.acceptedAt ? new Date(apiResponse.acceptedAt) : undefined,
  };
}

export function mapApiResponseListToDisplay(
  apiResponses: GroupMembershipApiResponse[],
): GroupMembershipDisplay[] {
  return apiResponses.map(mapApiResponseToDisplay);
}
