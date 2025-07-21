import {
  UserApiResponse,
  UserDisplay,
  UserProfileFormData,
} from '@/features/users/schemas';

export function mapApiResponseToDisplay(
  apiResponse: UserApiResponse
): UserDisplay {
  return {
    ...apiResponse,
  };
}

export function mapFormDataToApiRequest(data: UserProfileFormData): any {
  return {
    name: data.name,
    bio: data.bio,
  };
}
