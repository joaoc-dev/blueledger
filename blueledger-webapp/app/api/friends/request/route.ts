import { PusherEvent, PusherEvents } from '@/constants/pusher-events';
import { NOTIFICATION_TYPES } from '@/features/notifications.ts/constants';
import { createNotification } from '@/features/notifications.ts/data';
import { createNotificationSchema } from '@/features/notifications.ts/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { sendToPusher } from '@/lib/pusher/pusher-server';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import { validateRequest } from '@/app/api/validateRequest';

export const POST = withAuth(async function POST(request: NextAuthRequest) {
  try {
    const body = await request.json();
    //const userId = request.auth!.user!.id;
    //fromUser = userId;

    const validationResult = validateRequest(createNotificationSchema, {
      user: body.targetUserId,
      fromUser: '6861b5b421c376f9e0ceaedb',
      type: NOTIFICATION_TYPES.FRIEND_REQUEST,
      isRead: false,
    });

    if (!validationResult.success) return validationResult.error;

    await createNotification(validationResult.data!);

    const privateChannel = `private-user-${validationResult.data!.user}`;
    sendToPusher(privateChannel, PusherEvents.NOTIFICATION as PusherEvent, '');

    return NextResponse.json(
      { message: 'Friend request sent' },
      { status: 201 }
    );
  } catch (error) {
    console.log('Error sending friend request', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
