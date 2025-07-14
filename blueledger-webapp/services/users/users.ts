import { apiGet, apiPatch, apiPost } from '../api-client';
import { UserProfileFormData } from '@/lib/validations/user-schema';
import { UserType } from '@/types/user';
import { UserApiResponse, UserMapper } from './user-mapper';

export async function getUser(): Promise<UserType> {
  const response = await apiGet<UserApiResponse>(`/users/me`);
  return UserMapper.toType(response);
}

export async function updateUser(data: UserProfileFormData): Promise<UserType> {
  const request = UserMapper.toApiRequest(data);
  const response = await apiPatch<UserApiResponse>(`/users/me`, request);
  return UserMapper.toType(response);
}

export async function updateUserImage(image: Blob | null): Promise<UserType> {
  const formData = new FormData();
  if (image) {
    formData.append('image', image);
  }
  const response = await apiPost<UserApiResponse>(`/users/image`, formData);
  return UserMapper.toType(response);
}
