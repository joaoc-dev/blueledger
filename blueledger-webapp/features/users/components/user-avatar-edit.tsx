'use client';

import { Pencil } from 'lucide-react';
import { SessionProvider, useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { updateUserImage } from '@/features/users/client';
import AvatarCropperModal from './avatar-cropper-modal';
import { useUserStore } from './store';
import UserAvatar from './user-avatar';

export default function UserAvatarEdit() {
  const [cropperOpen, setCropperOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const setImage = useUserStore(state => state.setImage);
  const { update } = useSession();

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
      setImage(undefined);
      await update({
        user: {
          image: '',
        },
      });

      toast.success('Profile picture removed successfully');
    }
    catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove profile picture');
    }
  };

  return (
    <div className="relative inline-block w-fit h-fit">
      <UserAvatar className="h-32 w-32" />

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
      <SessionProvider>
        <AvatarCropperModal open={cropperOpen} onClose={handleModalClose} />
      </SessionProvider>
    </div>
  );
}
