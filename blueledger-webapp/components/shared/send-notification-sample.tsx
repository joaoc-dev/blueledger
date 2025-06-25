'use client';

import React from 'react';
import { Button } from '../ui/button';

const SendNotificationSample = () => {
  const sendNotification = () => {
    fetch('/api/notifications', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Hello, world!',
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return (
    <div>
      <Button onClick={() => sendNotification()}>Send Notification</Button>
    </div>
  );
};

export default SendNotificationSample;
