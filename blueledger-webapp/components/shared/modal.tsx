'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ModalProps {
  children: React.ReactNode;
  title: string;
  open: boolean;
  onClose?: () => void;
  goBackOnClose?: boolean;
}

export default function Modal({
  children,
  title,
  open,
  onClose,
  goBackOnClose,
}: ModalProps) {
  const router = useRouter();

  const handleClose = () => {
    onClose?.();
    if (goBackOnClose) {
      router.back();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen)
          handleClose();
      }}
    >
      <DialogContent className="w-full max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
