import type { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api/withAuth';
import { authorizeChannel } from '@/lib/pusher/pusher-server';

export const POST = withAuth(async (request: NextAuthRequest) => {
  try {
    const formData = await request.text();
    const params = new URLSearchParams(formData);

    const socket_id = params.get('socket_id');
    const channel_name = params.get('channel_name');

    const userId = request.auth!.user!.id;
    const expectedChannel = `private-user-${userId}`;

    if (channel_name !== expectedChannel) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authResponse = authorizeChannel(socket_id!, channel_name!);

    return NextResponse.json(authResponse);
  }
  catch (error) {
    console.error('Error authorizing channel', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});
