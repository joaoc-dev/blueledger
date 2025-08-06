import { markAllNotificationsAsRead } from '@/features/notifications/data';
import { withAuth } from '@/lib/api/withAuth';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';

export const PATCH = withAuth(async function PATCH(request: NextAuthRequest) {
  try {
    const userId = request.auth!.user!.id!;

    await markAllNotificationsAsRead(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 400 }
    );
  }
});
