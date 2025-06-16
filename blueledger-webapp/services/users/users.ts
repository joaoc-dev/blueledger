import { apiPatch } from '../api-client';
import { uploadToCloudinarySigned } from '../cloudinary';
import { UserProfileFormData } from '@/lib/validations/user-schema';
import { UserType } from '@/types/user';
import { UserApiResponse, UserMapper } from './user-mapper';

export async function updateUser(data: UserProfileFormData): Promise<UserType> {
  const request = UserMapper.toApiRequest(data);
  const response = await apiPatch<UserApiResponse>(`/users/me`, request);
  return UserMapper.toType(response);
}

export async function updateUserImage(imageUrl: string): Promise<UserType> {
  const request = { image: imageUrl };
  const response = await apiPatch<UserApiResponse>(`/users/me`, request);
  return UserMapper.toType(response);
}

// TODO: We are sending image to cloudinary and an error can occur on our backend after that.
// By Sending the image to our backend, we can create an endpoint that will handle the entire logic.
// Should be analyzed if this is a good idea.
export async function uploadAndSetUserImage(blob: Blob): Promise<UserType> {
  const url = await uploadToCloudinarySigned(blob);
  return updateUserImage(url);
}
