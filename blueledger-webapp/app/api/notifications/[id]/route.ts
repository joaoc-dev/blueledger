import { updateNotification } from '@/features/notifications/data';
import { patchNotificationSchema } from '@/features/notifications/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import { validateRequest } from '../../validateRequest';

export const PATCH = withAuth(async function PATCH(
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validationResult = validateRequest(patchNotificationSchema, {
      id,
      data: body,
    });
    if (!validationResult.success) return validationResult.error;

    const notification = await updateNotification(validationResult.data!);

    return NextResponse.json(notification, { status: 200 });
  } catch (error) {
    console.log('Error patching notification', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
