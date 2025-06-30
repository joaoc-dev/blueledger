// import { connectToDB } from '@/lib/mongoose';
// import { Notification } from '@/lib/models/Notification';
// import { pusherServer } from '@/lib/pusher-server';
import { withAuth } from '@/lib/api/withAuth';
import { getNotifications } from '@/lib/data/notifications';
import dbConnect from '@/lib/db/mongoose-client';
import { sendNotification } from '@/lib/pusher';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST() {
  // await connectToDB();

  // const notification = await Notification.create({
  //   userId: '123', // hardcoded user
  //   message: 'You triggered a notification!'
  // });

  const notification = {
    userId: 'user-123',
    message: 'You triggered a notification!',
  };

  // // Trigger real-time event
  sendNotification(notification.userId, notification.message);

  console.log('Notifications API route called');

  return NextResponse.json({ success: true });
}

export const GET = withAuth(async function GET(request: NextAuthRequest) {
  try {
    await dbConnect();
    const notifications = await getNotifications();
    return NextResponse.json(notifications);
  } catch (error) {
    console.log('Error getting expenses', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
