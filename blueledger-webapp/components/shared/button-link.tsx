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
  onClick?: () => void;
}

function ButtonLink({
  href,
  children,
  variant,
  size,
  className,
  disabled,
  onClick,
}: ButtonLinkProps) {
  return (
    <>
      {disabled
        ? (
            <Button
              variant={variant}
              size={size}
              className={className}
              disabled={true}
              onClick={onClick}
            >
              {children}
            </Button>
          )
        : (
            <Button asChild variant={variant} size={size} className={className} onClick={onClick}>
              <Link href={href}>{children}</Link>
            </Button>
          )}
    </>
  );
}

export default ButtonLink;
