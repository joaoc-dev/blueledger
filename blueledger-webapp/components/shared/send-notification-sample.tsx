'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { apiPost } from '@/lib/api-client';

function SendNotificationSample() {
  // all of the following should be rate limited

  // on creating friendship, a notification should be sent to the other user
  // if friendship already exists but is pending, no notification should be sent
  const sendFriendRequest = () => {
    apiPost('/friends/request', {
      targetUserId: '685287dc739c1c2fd7d8922e',
    }).then(res => console.warn(res));
  };

  // on creating or updating a group,
  // a notification should be sent to the other user that is being added to the group
  const sendGroupInvitation = () => {
    apiPost('/groups/invite', {
      targetUserId: '685287dc739c1c2fd7d8922e',
    }).then(res => console.warn(res));
  };

  // this should be replaced by logic in the post expense endpoint
  // on creating an expense
  // solo expenses: nothing
  // shared with a friend: a notification should be sent to the other user
  // shared with a group: a notification should be sent to all users in group
  const sendExpenseNotification = () => {
    apiPost('/expenses/notification', {
      targetUserId: '685287dc739c1c2fd7d8922e',
    }).then(res => console.warn(res));
  };

  return (
    <div>
      <Button onClick={() => sendFriendRequest()}>Send Friend Request</Button>
      <Button onClick={() => sendGroupInvitation()}>
        Send Group Invitation
      </Button>
      <Button onClick={() => sendExpenseNotification()}>
        Send Expense Notification
      </Button>
    </div>
  );
}

export default SendNotificationSample;
