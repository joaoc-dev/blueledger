import User from '@/features/users/model';
import { PatchUserData, UserDisplay } from '@/features/users/schemas';
import dbConnect from '@/lib/db/mongoose-client';
import mongoose from 'mongoose';
import { mapModelToDisplay } from './mapper-server';

export async function getUserById(id: string): Promise<UserDisplay | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  await dbConnect();

  const user = await User.findById(id);

  return user ? mapModelToDisplay(user) : null;
}

export async function updateUser(userData: PatchUserData) {
  await dbConnect();

  const user = await User.findByIdAndUpdate(userData.id, userData.data, {
    new: true,
  });

  return user ? mapModelToDisplay(user) : null;
}

export async function removeImageFromUser(
  userId: string
): Promise<UserDisplay | null> {
  return await updateUser({
    id: userId,
    data: {
      image: '',
      imagePublicId: '',
    },
  });
}
