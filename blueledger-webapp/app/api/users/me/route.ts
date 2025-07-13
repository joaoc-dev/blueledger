import { withAuth } from '@/lib/api/withAuth';
import { getUserById, updateUser } from '@/lib/data/users';
import { patchUserSchema } from '@/lib/validations/user-schema';
import { UserType } from '@/types/user';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';

export const GET = withAuth(async function GET(request: NextAuthRequest) {
  try {
    const userId = request.auth?.user?.id;

    const user = await getUserById(userId!);

    console.log('user', user);
    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    console.log('Error getting user', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});

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

    const user = await updateUser(userId!, validation.data.body as UserType);

    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user, message: 'User updated successfully' });
  } catch (error) {
    console.log('Error updating user', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
