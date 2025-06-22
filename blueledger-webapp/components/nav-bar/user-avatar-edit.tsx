'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import UserAvatar from './user-avatar';
import { User } from 'next-auth';
import { useState } from 'react';
import AvatarCropperModal from '../users/avatar-cropper-modal';
import { updateUserImage } from '@/services/users/users';
import { toast } from 'sonner';

export function UserAvatarEdit({ user }: { user: User }) {
  const [cropperOpen, setCropperOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleModalClose = () => {
    setCropperOpen(false);
  };

  const handleUpload = () => {
    // Close dropdown first, then open modal
    setDropdownOpen(false);
    setCropperOpen(true);
  };

  const handleRemove = async () => {
    try {
      await updateUserImage(null);
      toast.success('Profile picture removed successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove profile picture');
    }
  };

  return (
    <div className="relative inline-block w-fit h-fit">
      <UserAvatar user={user} className="h-32 w-32" />

      <div className="absolute bottom-[-15px] right-[-10px]">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="shadow-md flex items-center gap-1 rounded-xl"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom">
            <DropdownMenuItem onClick={handleUpload}>
              Upload a photo...
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRemove}>
              Remove photo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AvatarCropperModal open={cropperOpen} onClose={handleModalClose} />
    </div>
  );
}
