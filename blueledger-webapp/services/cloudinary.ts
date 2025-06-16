import axios from 'axios';
import { apiGet } from './api-client';

async function getSignature(): Promise<{
  signature: string;
  timestamp: number;
}> {
  return apiGet('sign-cloudinary-params');
}

export async function uploadToCloudinarySigned(blob: Blob) {
  const { signature, timestamp } = await getSignature();

  const uploadPreset = process.env
    .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string;

  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string;

  const formData = new FormData();
  formData.append('file', blob);
  formData.append('upload_preset', uploadPreset);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp.toString());
  formData.append('api_key', apiKey);

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
  const { data } = await axios.post(cloudinaryUrl, formData);

  return data.secure_url;
}
