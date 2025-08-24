import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { getUserById, removeImageFromUser } from '@/features/users/data';
import { withAuth } from '@/lib/api/withAuth';
import {
  destroyImage,
  handleImageUploadAndUserUpdate,
  removePreviousImageIfExists,
} from '@/lib/cloudinary';
import { createLogger, logRequest } from '@/lib/logger';

export const POST = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/users/image/post');
  const startTime = Date.now();
  let publicId: string | null | undefined;
  let imageUrl: string | null | undefined;
  let requestId: string | undefined;

  try {
    ({ requestId } = logRequest(logger, request));
    const formData = await request.formData();
    const image = formData.get('image') as Blob;

    const userId = request.auth?.user?.id;
    const user = await getUserById(userId!);
    if (!user) {
      logger.warn(LogEvents.USER_NOT_FOUND, {
        requestId,
        userId,
        status: 404,
        durationMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const originalImagePublicId = user.imagePublicId;

    // Check if image is provided and not empty (handle empty string for removal)
    if (image && (typeof image === 'string' ? (image as string).trim() !== '' : image.size > 0)) {
      const updatedUser = await handleImageUploadAndUserUpdate(userId!, image);
      publicId = updatedUser.imagePublicId;
      imageUrl = updatedUser.image;

      await removePreviousImageIfExists(originalImagePublicId);
    }
    else {
      const updatedUser = await removeImageFromUser(userId!);
      if (!updatedUser) {
        logger.warn(LogEvents.USER_NOT_FOUND, {
          requestId,
          userId,
          status: 404,
          durationMs: Date.now() - startTime,
        });
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      await removePreviousImageIfExists(originalImagePublicId);
    }

    logger.info(LogEvents.USER_IMAGE_UPDATED, {
      requestId,
      userId,
      status: 200,
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json({ image: imageUrl }, { status: 200 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_UPDATING_USER_IMAGE, {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      durationMs: Date.now() - startTime,
    });

    if (publicId) {
      const destroyResult = await destroyImage(publicId);
      logger.warn('destroy_public_image_rollback', {
        requestId,
        publicId,
        destroyResult,
      });
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});
