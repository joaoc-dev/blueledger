import { withAuth } from '@/lib/api/withAuth';
import {
  destroyImage,
  handleImageUploadAndUserUpdate,
  removePreviousImageIfExists,
} from '@/lib/cloudinary';
import { getUserById, removeImageFromUser } from '@/lib/data/users';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';

export const POST = withAuth(async function POST(request: NextAuthRequest) {
  let publicId: string | null | undefined;

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

      await removePreviousImageIfExists(originalImagePublicId);
    } else {
      const updatedUser = await removeImageFromUser(userId!);
      if (!updatedUser)
        return NextResponse.json({ error: 'User not found' }, { status: 404 });

      await removePreviousImageIfExists(originalImagePublicId);
    }

    return NextResponse.json(
      { message: 'Image updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user image', error);

    if (publicId) {
      const destroyResult = await destroyImage(publicId);
      console.log('destroyResult (rollback)', destroyResult);
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
