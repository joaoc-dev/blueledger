import { Button } from '@/components/ui-modified/button';
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
  variant?: 'default' | 'destructive';
  onConfirm?: () => void;
  onCancel?: () => void;
}

function ConfirmationDialog({
  title = 'Dialog Title',
  description,
  cancelButtonText = 'Cancel',
  confirmButtonText = 'Confirm',
  onConfirm,
  onCancel,
  variant,
}: ConfirmationDialogProps) {
  return (
    <DialogContent className="w-xs">
      <DialogHeader className="mb-4">
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      <DialogFooter className="flex gap-2">
        <DialogClose asChild>
          <Button className="flex-1" variant="outline" onClick={onCancel}>
            {cancelButtonText}
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button className="flex-1" variant={variant} onClick={onConfirm}>
            {confirmButtonText}
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

export default ConfirmationDialog;
