import type { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import { getUserById, removeImageFromUser } from '@/features/users/data';
import { withAuth } from '@/lib/api/withAuth';
import {
  destroyImage,
  handleImageUploadAndUserUpdate,
  removePreviousImageIfExists,
} from '@/lib/cloudinary';

export const POST = withAuth(async (request: NextAuthRequest) => {
  let publicId: string | null | undefined;
  let imageUrl: string | null | undefined;

  try {
    const formData = await request.formData();
    const image = formData.get('image') as Blob;

    const userId = request.auth?.user?.id;
    const user = await getUserById(userId!);
    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const originalImagePublicId = user.imagePublicId;

    if (image) {
      const updatedUser = await handleImageUploadAndUserUpdate(userId!, image);
      publicId = updatedUser.imagePublicId;
      imageUrl = updatedUser.image;

      await removePreviousImageIfExists(originalImagePublicId);
    }
    else {
      const updatedUser = await removeImageFromUser(userId!);
      if (!updatedUser)
        return NextResponse.json({ error: 'User not found' }, { status: 404 });

      await removePreviousImageIfExists(originalImagePublicId);
    }

    return NextResponse.json({ image: imageUrl }, { status: 200 });
  }
  catch (error) {
    console.error('Error updating user image', error);

    if (publicId) {
      const destroyResult = await destroyImage(publicId);
      console.warn('destroyResult (rollback)', destroyResult);
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});
