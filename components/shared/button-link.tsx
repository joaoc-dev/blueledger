import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui-modified/button';
import { cn } from '@/lib/utils';

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
  const buttonClass = 'cursor-pointer hover:shadow-sm focus-visible:ring-ring/40';
  const hoverClass = className?.includes('hover:bg-') ? '' : 'hover:bg-primary/90 dark:hover:bg-primary/85';
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
            <Button
              asChild
              variant={variant}
              size={size}
              className={cn(buttonClass, hoverClass, className)}
              onClick={onClick}
            >
              <Link href={href}>{children}</Link>
            </Button>
          )}
    </>
  );
}

export default ButtonLink;
