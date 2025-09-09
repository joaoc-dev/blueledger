import React from 'react';
import { vi } from 'vitest';

// Mock UI components globally before any tests run
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, onClick, ...props }: any) => (
    <button {...props} type="button" onClick={onClick} data-variant={variant}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, ...props }: any) => <div {...props} data-testid="dialog">{children}</div>,
  DialogContent: ({ children, ...props }: any) => <div {...props} data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children, ...props }: any) => <div {...props} data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children, ...props }: any) => <h2 {...props} data-testid="dialog-title">{children}</h2>,
  DialogDescription: ({ children, ...props }: any) => <p {...props} data-testid="dialog-description">{children}</p>,
  DialogFooter: ({ children, ...props }: any) => <div {...props} data-testid="dialog-footer">{children}</div>,
  DialogClose: ({ children, ...props }: any) => <div {...props} data-testid="dialog-close">{children}</div>,
}));
