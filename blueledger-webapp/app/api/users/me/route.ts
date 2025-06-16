import { withAuth } from '@/lib/api/withAuth';
import dbConnect from '@/lib/db/mongoose-client';
import { patchUserSchema } from '@/lib/validations/user-schema';
import User from '@/models/user.model';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';

export const PATCH = withAuth(async function PATCH(request: NextAuthRequest) {
  try {
    const userId = request.auth?.user?.id;
    const body = await request.json();

    const validation = patchUserSchema.safeParse({
      params: { id: userId },
      body,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findById(userId);

    if (!existingUser)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const user = await User.findByIdAndUpdate(userId, validation.data.body, {
      new: true,
    });

    return NextResponse.json({ user, message: 'User updated successfully' });
  } catch (error) {
    console.log('Error updating user', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
