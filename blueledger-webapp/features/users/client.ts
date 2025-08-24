import type { UserApiResponse, UserDisplay, UserProfileFormData } from './schemas';
import { apiGet, apiPatch, apiPost } from '@/lib/api-client';
import {
  mapApiResponseToDisplay,
  mapFormDataToApiRequest,
} from './mapper-client';

export async function getUser(): Promise<UserDisplay> {
  const response = await apiGet<UserApiResponse>(`/users/me`);
  return mapApiResponseToDisplay(response);
}

export async function lookupUserByEmail(email: string): Promise<UserDisplay> {
  const response = await apiGet<UserApiResponse>(`/users/lookup/${email}`);
  return mapApiResponseToDisplay(response);
}

export async function updateUser(
  data: UserProfileFormData,
): Promise<UserDisplay> {
  const request = mapFormDataToApiRequest(data);
  const response = await apiPatch<UserApiResponse>(`/users/me`, request);
  return mapApiResponseToDisplay(response);
}

export async function updateUserImage(
  image: Blob | null,
): Promise<UserDisplay> {
  const formData = new FormData();
  if (image) {
    formData.append('image', image);
  }
  else {
    formData.append('image', '');
  }
  const response = await apiPost<UserApiResponse>(`/users/image`, formData);
  return mapApiResponseToDisplay(response);
}
