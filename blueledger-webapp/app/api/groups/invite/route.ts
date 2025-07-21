import { withAuth } from '@/lib/api/withAuth';
import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/app/api/validateRequest';
import { createNotificationSchema } from '@/features/notifications.ts/schemas';
import { NOTIFICATION_TYPES } from '@/features/notifications.ts/constants';
import { createNotification } from '@/features/notifications.ts/data';
import { sendToPusher } from '@/lib/pusher/pusher-server';
import { PusherEvent, PusherEvents } from '@/constants/pusher-events';

export const POST = withAuth(async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    //const userId = request.auth!.user!.id;
    //fromUser = userId;

    const validationResult = validateRequest(createNotificationSchema, {
      user: body.targetUserId,
      fromUser: '6861b5b421c376f9e0ceaedb',
      type: NOTIFICATION_TYPES.GROUP_INVITE,
      isRead: false,
    });

    if (!validationResult.success) return validationResult.error;

    await createNotification(validationResult.data!);

    sendToPusher(
      validationResult.data!.user,
      PusherEvents.NOTIFICATION as PusherEvent,
      ''
    );

    return NextResponse.json({ message: 'Group invite sent' }, { status: 201 });
  } catch (error) {
    console.log('Error sending group invite', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
