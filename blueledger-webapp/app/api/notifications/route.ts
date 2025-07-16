import { withAuth } from '@/lib/api/withAuth';
import { getNotifications } from '@/features/notifications.ts/data';
import { NextResponse } from 'next/server';

export const GET = withAuth(async function GET() {
  try {
    const notifications = await getNotifications();

    return NextResponse.json(notifications);
  } catch (error) {
    console.log('Error getting notifications', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
