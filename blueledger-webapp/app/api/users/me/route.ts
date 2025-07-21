import { validateRequest } from '@/app/api/validateRequest';
import { getUserById, updateUser } from '@/features/users/data';
import { patchUserSchema } from '@/features/users/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';

export const GET = withAuth(async function GET(request: NextAuthRequest) {
  try {
    const userId = request.auth?.user?.id;

    const user = await getUserById(userId!);

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

    const validationResult = validateRequest(patchUserSchema, {
      id: userId,
      data: body,
    });
    if (!validationResult.success) return validationResult.error;

    const user = await updateUser(validationResult.data!);

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
