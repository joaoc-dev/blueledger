import { UserType } from '@/types/user';
import User, { UserDocument } from '@/models/user.model';
import dbConnect from '@/lib/db/mongoose-client';
import mongoose from 'mongoose';

function toUserType(user: UserDocument): UserType {
  const { _id, ...rest } = user.toObject ? user.toObject() : user;
  return {
    ...rest,
    id: _id?.toString(),
  };
}

export async function getUserById(id: string): Promise<UserType | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  await dbConnect();

  const user = await User.findById(id);

  return user ? toUserType(user) : null;
}

export async function updateUser(id: string, data: Partial<UserType>) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  await dbConnect();

  const user = await User.findByIdAndUpdate(id, data, { new: true });

  return user ? toUserType(user) : null;
}

export async function removeImageFromUser(
  userId: string
): Promise<UserType | null> {
  return await updateUser(userId, {
    image: '',
    imagePublicId: '',
  });
}
