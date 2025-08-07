import type { UserDisplay } from '@/features/users/schemas';
import { Buffer } from 'node:buffer';
import * as Sentry from '@sentry/nextjs';
import { v2 as cloudinary } from 'cloudinary';
import { LogEvents } from '@/constants/log-events';
import { env } from '@/env/server';
import { updateUser } from '@/features/users/data';
import { createLogger } from '@/lib/logger';

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
  const logger = createLogger('lib/cloudinary');
  const startTime = Date.now();

  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { signature, timestamp } = await getSignature();

  logger.info(LogEvents.CLOUDINARY_UPLOAD_STARTED, {
    timestamp,
  });

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
        if (error) {
          Sentry.captureException(error);

          logger.error(LogEvents.CLOUDINARY_UPLOAD_FAILED, {
            error: error instanceof Error ? error.message : 'Unknown error',
            durationMs: Date.now() - startTime,
          });

          return reject(error);
        }

        logger.info(LogEvents.CLOUDINARY_UPLOAD_SUCCESS, {
          durationMs: Date.now() - startTime,
        });

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
  const logger = createLogger('lib/cloudinary');
  const startTime = Date.now();

  logger.info(LogEvents.CLOUDINARY_DESTROY_STARTED, { publicId });

  const destroyResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        Sentry.captureException(error);
        return reject(error);
      }
      return resolve(result);
    });
  });

  logger.info(LogEvents.CLOUDINARY_DESTROY_SUCCESS, {
    publicId,
    durationMs: Date.now() - startTime,
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
    const logger = createLogger('lib/cloudinary');
    const result = await destroyImage(publicId);

    logger.warn(LogEvents.CLOUDINARY_DESTROY_SUCCESS, {
      publicId,
      result,
    });
  }
  catch (error) {
    const logger = createLogger('lib/cloudinary');

    Sentry.captureException(error);

    logger.warn(LogEvents.CLOUDINARY_DESTROY_FAILED, {
      publicId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export {
  destroyImage,
  handleImageUploadAndUserUpdate,
  removePreviousImageIfExists,
  uploadImage,
};
