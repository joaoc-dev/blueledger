import { NextResponse } from 'next/server';
import { getNotifications } from '@/features/notifications/data';
import { withAuth } from '@/lib/api/withAuth';

export const GET = withAuth(async () => {
  try {
    const notifications = await getNotifications();

    return NextResponse.json(notifications);
  }
  catch (error) {
    console.error('Error getting notifications', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});
