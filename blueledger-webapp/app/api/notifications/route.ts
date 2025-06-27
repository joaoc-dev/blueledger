// import { connectToDB } from '@/lib/mongoose';
// import { Notification } from '@/lib/models/Notification';
// import { pusherServer } from '@/lib/pusher-server';
import { sendNotification } from '@/lib/pusher';
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
