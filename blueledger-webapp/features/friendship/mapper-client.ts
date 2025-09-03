import type {
  FriendshipApiResponse,
  FriendshipDisplay,
} from './schemas';

export function mapApiResponseToDisplay(
  apiResponse: FriendshipApiResponse,
): FriendshipDisplay {
  // Compute friend based on userIsRequester
  const friend = apiResponse.userIsRequester
    ? {
        name: apiResponse.recipientName,
        email: apiResponse.recipientEmail,
        image: apiResponse.recipientImage,
      }
    : {
        name: apiResponse.requesterName,
        email: apiResponse.requesterEmail,
        image: apiResponse.requesterImage,
      };

  return {
    ...apiResponse,
    friend,
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
