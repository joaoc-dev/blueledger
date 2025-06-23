'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ModalProps {
  children: React.ReactNode;
  title: string;
  open: boolean;
  onClose?: () => void;
}

export default function Modal({
  children,
  title,
  onClose = () => {},
}: ModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    router.back();
    onClose();
  };

  return (
    <Dialog defaultOpen={true} open={open} onOpenChange={handleClose}>
      <DialogOverlay>
        <DialogContent className="w-fit">
          <DialogHeader className="mb-4">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
