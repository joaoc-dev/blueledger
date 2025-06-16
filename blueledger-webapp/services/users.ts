import { api } from './api-client';
import { uploadToCloudinarySigned } from './cloudinary';

export async function updateUser(data: { image: string }) {
  return api.patch(`/users/me`, data);
}

export async function updateUserImage(imageUrl: string) {
  return api.patch(`/users/me`, { image: imageUrl });
}

// TODO: We are sending image to cloudinary and an error can occur on our backend after that.
// By Sending the image to our backend, we can create an endpoint that will handle the entire logic.
// Should be analyzed if this is a good idea.
export async function uploadAndSetUserImage(blob: Blob): Promise<string> {
  const url = await uploadToCloudinarySigned(blob);
  await updateUserImage(url);
  return url;
}
