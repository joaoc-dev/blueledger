import type { UserApiResponse, UserDisplay, UserProfileFormData } from './schemas';

export function mapApiResponseToDisplay(
  apiResponse: UserApiResponse,
): UserDisplay {
  return {
    ...apiResponse,
    emailVerified: apiResponse.emailVerified ? new Date(apiResponse.emailVerified) : undefined,
  };
}

export function mapFormDataToApiRequest(data: UserProfileFormData): any {
  return {
    name: data.name,
    bio: data.bio,
  };
}
