import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  disabled?: boolean;
}

const ButtonLink = ({
  href,
  children,
  variant,
  size,
  className,
  disabled,
}: ButtonLinkProps) => {
  return (
    <>
      {disabled ? (
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={true}
        >
          {children}
        </Button>
      ) : (
        <Button asChild variant={variant} size={size} className={className}>
          <Link href={href}>{children}</Link>
        </Button>
      )}
    </>
  );
};

export default ButtonLink;
