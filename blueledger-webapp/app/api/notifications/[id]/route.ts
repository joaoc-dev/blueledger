import type { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import { updateNotification } from '@/features/notifications/data';
import { patchNotificationSchema } from '@/features/notifications/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { validateRequest } from '../../validateRequest';

export const PATCH = withAuth(async (
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const body = await request.json();

    const validationResult = validateRequest(patchNotificationSchema, {
      id,
      data: body,
    });

    if (!validationResult.success)
      return NextResponse.json(validationResult.error, { status: 400 });

    const notification = await updateNotification(validationResult.data!);

    return NextResponse.json(notification, { status: 200 });
  }
  catch (error) {
    console.error('Error patching notification', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});
