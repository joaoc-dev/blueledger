'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';

interface ModalProps {
  children: React.ReactNode;
  title: string;
  open: boolean;
  onClose?: () => void;
}

export default function Modal({
  children,
  title,
  onClose,
}: ModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
    router.back();
  };

  return (
    <Dialog defaultOpen={true} open={open} onOpenChange={handleClose}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-sm sm:max-w-md">
          <DialogHeader className="mb-4">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
