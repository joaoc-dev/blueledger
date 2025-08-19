import type { CreateUserData, PatchUserData, UserAuthRecord, UserDisplay } from './schemas';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose-client';
import { mapModelToDisplay } from './mapper-server';
import User from './model';

export async function getUserById(id: string): Promise<UserDisplay | null> {
  if (!mongoose.Types.ObjectId.isValid(id))
    return null;

  await dbConnect();

  const user = await User.findById(id);

  return user ? mapModelToDisplay(user) : null;
}

export async function getUserByEmail(email: string): Promise<UserDisplay | null> {
  await dbConnect();

  const user = await User.findOne({ email: email.toLowerCase() });

  return user ? mapModelToDisplay(user) : null;
}

export async function createUser(userData: CreateUserData) {
  await dbConnect();

  const user = await User.create(userData);

  return mapModelToDisplay(user);
}

export async function updateUser(userData: PatchUserData) {
  await dbConnect();

  const user = await User.findByIdAndUpdate(userData.id, userData.data, {
    new: true,
  });

  return user ? mapModelToDisplay(user) : null;
}

export async function removeImageFromUser(
  userId: string,
): Promise<UserDisplay | null> {
  await dbConnect();

  return await updateUser({
    id: userId,
    data: {
      image: '',
      imagePublicId: '',
    },
  });
}

// Auth-facing repository methods (return validated plain objects and explicit writes)
export async function getUserAuthRecordById(userId: string): Promise<UserAuthRecord | null> {
  if (!mongoose.Types.ObjectId.isValid(userId))
    return null;

  await dbConnect();
  const user = await User.findById(userId);
  if (!user)
    return null;

  const record: UserAuthRecord = {
    id: String(user._id),
    name: user.name,
    image: user.image,
    email: user.email,
    bio: user.bio,
    passwordHash: user.passwordHash,
    emailVerified: user.emailVerified ?? null,
    emailVerificationCode: user.emailVerificationCode,
    emailVerificationCodeExpires: user.emailVerificationCodeExpires ?? null,
    passwordResetCode: user.passwordResetCode,
    passwordResetCodeExpires: user.passwordResetCodeExpires ?? null,
    sessionInvalidAfter: user.sessionInvalidAfter ?? null,
  };

  return record;
}

export async function getUserAuthRecordByEmail(email: string): Promise<UserAuthRecord | null> {
  await dbConnect();
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user)
    return null;

  const record: UserAuthRecord = {
    id: String(user._id),
    name: user.name,
    image: user.image,
    email: user.email,
    bio: user.bio,
    passwordHash: user.passwordHash,
    emailVerified: user.emailVerified ?? null,
    emailVerificationCode: user.emailVerificationCode,
    emailVerificationCodeExpires: user.emailVerificationCodeExpires ?? null,
    passwordResetCode: user.passwordResetCode,
    passwordResetCodeExpires: user.passwordResetCodeExpires ?? null,
    sessionInvalidAfter: user.sessionInvalidAfter ?? null,
  };

  return record;
}

export async function setEmailVerificationCode(userId: string, params: {
  codeHash: string;
  expires: Date;
}): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(userId))
    return;

  await dbConnect();
  await User.findByIdAndUpdate(userId, {
    $set: {
      emailVerificationCode: params.codeHash,
      emailVerificationCodeExpires: params.expires,
    },
  });
}

export async function removeEmailVerificationCode(userId: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(userId))
    return;

  await dbConnect();
  await User.findByIdAndUpdate(userId, {
    $unset: {
      emailVerificationCode: 1,
      emailVerificationCodeExpires: 1,
    },
  });
}

export async function markEmailVerified(userId: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(userId))
    return;

  await dbConnect();
  await User.findByIdAndUpdate(userId, {
    $set: { emailVerified: new Date() },
    $unset: {
      emailVerificationCode: 1,
      emailVerificationCodeExpires: 1,
    },
  });
}

export async function setPasswordResetCode(email: string, params: { codeHash: string; expires: Date }): Promise<void> {
  await dbConnect();
  await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      $set: {
        passwordResetCode: params.codeHash,
        passwordResetCodeExpires: params.expires,
      },
    },
  );
}

export async function removePasswordResetCode(email: string): Promise<void> {
  await dbConnect();
  await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { $unset: {
      passwordResetCode: 1,
      passwordResetCodeExpires: 1,
    } },
  );
}

export async function updatePasswordAndClearReset(email: string, params: { passwordHash: string }): Promise<void> {
  await dbConnect();
  await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      $set: { passwordHash: params.passwordHash },
      $unset: {
        passwordResetCode: 1,
        passwordResetCodeExpires: 1,
      },
    },
  );
}
