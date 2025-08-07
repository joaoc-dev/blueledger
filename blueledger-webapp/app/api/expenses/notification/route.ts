import type { NextRequest } from 'next/server';
import type { PusherEvent } from '@/constants/pusher-events';
import { NextResponse } from 'next/server';
import { validateRequest } from '@/app/api/validateRequest';
import { PusherEvents } from '@/constants/pusher-events';
import { NOTIFICATION_TYPES } from '@/features/notifications/constants';
import { createNotification } from '@/features/notifications/data';
import { createNotificationSchema } from '@/features/notifications/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { sendToPusher } from '@/lib/pusher/pusher-server';

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    // const userId = request.auth!.user!.id;
    // fromUser = userId;

    const validationResult = validateRequest(createNotificationSchema, {
      user: body.targetUserId,
      fromUser: '6861b5b421c376f9e0ceaedb',
      type: NOTIFICATION_TYPES.ADDED_TO_EXPENSE,
      isRead: false,
    });

    if (!validationResult.success)
      return NextResponse.json(validationResult.error, { status: 400 });

    await createNotification(validationResult.data!);

    const privateChannel = `private-user-${validationResult.data!.user}`;
    sendToPusher(privateChannel, PusherEvents.NOTIFICATION as PusherEvent, '');

    return NextResponse.json(
      { message: 'Expense notification sent' },
      { status: 201 },
    );
  }
  catch (error) {
    console.error('Error sending expense notification', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});
