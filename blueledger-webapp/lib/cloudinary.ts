import type { UserDisplay } from '@/features/users/schemas';
import { Buffer } from 'node:buffer';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '@/env/server';
import { updateUser } from '@/features/users/data';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

async function getSignature() {
  const timestamp = Math.floor(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      upload_preset: env.CLOUDINARY_UPLOAD_PRESET,
      timestamp,
      filename_override: timestamp.toString(),
    },
    env.CLOUDINARY_API_SECRET,
  );

  return { signature, timestamp };
}

async function uploadImage(image: Blob): Promise<{
  public_id: string;
  secure_url: string;
}> {
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { signature, timestamp } = await getSignature();

  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        upload_preset: env.CLOUDINARY_UPLOAD_PRESET,
        signature,
        timestamp,
        api_key: env.CLOUDINARY_API_KEY,
        filename_override: timestamp.toString(),
      },
      (error, result) => {
        if (error)
          return reject(error);
        return resolve(result);
      },
    );

    uploadStream.end(buffer);
  });

  return uploadResult as {
    public_id: string;
    secure_url: string;
  };
}

async function destroyImage(publicId: string) {
  const destroyResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error)
        return reject(error);
      return resolve(result);
    });
  });

  return destroyResult;
}

async function handleImageUploadAndUserUpdate(
  userId: string,
  image: Blob,
): Promise<UserDisplay> {
  const uploadResult = await uploadImage(image);
  const publicId = uploadResult.public_id;

  const updatedUser = await updateUser({
    id: userId,
    data: {
      image: uploadResult.secure_url,
      imagePublicId: publicId,
    },
  });

  if (!updatedUser) {
    await destroyImage(publicId);
    throw new Error('User not found after image upload');
  }

  return updatedUser;
}

async function removePreviousImageIfExists(
  publicId: string | null | undefined,
) {
  if (!publicId)
    return;
  try {
    const result = await destroyImage(publicId);
    console.warn('Previous image destroyed:', result);
  }
  catch (error) {
    console.warn('Failed to destroy old image:', error);
  }
}

export {
  destroyImage,
  handleImageUploadAndUserUpdate,
  removePreviousImageIfExists,
  uploadImage,
};
