import { Button, Html } from '@react-email/components';
import * as React from 'react';

interface MyEmailProps {
  firstName: string;
}

export function MyEmail({ firstName }: MyEmailProps) {
  return (
    <Html>
      <Button
        href="https://example.com"
        style={{ background: '#000', color: '#fff', padding: '12px 20px' }}
      >
        Click me,
        {' '}
        {firstName}
        !
      </Button>
    </Html>
  );
}

export default MyEmail;
