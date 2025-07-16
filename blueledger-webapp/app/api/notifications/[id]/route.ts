import { withAuth } from '@/lib/api/withAuth';
import {
  getNotificationById,
  updateNotification,
} from '@/lib/data/notifications';
import { patchNotificationSchema } from '@/lib/validations/notification-schema';
import { NotificationType } from '@/types/notification';
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

    const { error, data } = validateRequest(patchNotificationSchema, {
      params: { id },
      body,
    });
    if (error) return error;

    const existingNotification = await getNotificationById(id);
    if (!existingNotification)
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );

    const updatedData: Partial<NotificationType> = {
      ...existingNotification,
      ...data!.body,
    };

    const notification = await updateNotification(updatedData);

    return NextResponse.json(notification, { status: 200 });
  } catch (error) {
    console.log('Error patching notification', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
