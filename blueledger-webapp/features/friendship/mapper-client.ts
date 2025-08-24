import type {
  FriendshipApiResponse,
  FriendshipDisplay,
} from './schemas';

export function mapApiResponseToDisplay(
  apiResponse: FriendshipApiResponse,
): FriendshipDisplay {
  return {
    ...apiResponse,
    createdAt: new Date(apiResponse.createdAt),
    updatedAt: new Date(apiResponse.updatedAt),
    acceptedAt: apiResponse.acceptedAt ? new Date(apiResponse.acceptedAt) : undefined,
  };
}

export function mapApiResponseListToDisplay(
  apiResponses: FriendshipApiResponse[],
): FriendshipDisplay[] {
  return apiResponses.map(mapApiResponseToDisplay);
}
