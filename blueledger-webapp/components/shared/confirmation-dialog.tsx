import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ConfirmationDialogProps {
  title?: string;
  description?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

function ConfirmationDialog({
  title = 'Dialog Title',
  description = 'Dialog description',
  cancelButtonText = 'Cancel',
  confirmButtonText = 'Confirm',
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" onClick={onCancel}>
            {cancelButtonText}
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmButtonText}
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

export default ConfirmationDialog;
