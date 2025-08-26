'use client';

import type { FriendshipDisplay } from '@/features/friendship/schemas';
import { UserMinus } from 'lucide-react';
import ConfirmationDialog from '@/components/shared/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { FRIENDSHIP_STATUS } from '../../../constants';
import AcceptFriendship from './accept-friendship';
import CancelFriendship from './cancel-friendship';
import DeclineFriendship from './decline-friendship';

interface ItemOptionsProps {
  friendship: FriendshipDisplay;
  isCompact?: boolean;
}

function FriendshipActions({ friendship, isCompact = false }: ItemOptionsProps) {
  const isActiveFriendship = friendship.status === FRIENDSHIP_STATUS.ACCEPTED;

  if (isActiveFriendship) {
    return <RemoveFriendship id={friendship.id} isCompact={isCompact} disabled={!!friendship.optimisticId} />;
  }

  return (
    <>
      {
        friendship.userIsRequester
          ? (
              <CancelFriendship friendship={friendship} isCompact={isCompact} disabled={!!friendship.optimisticId} />
            )
          : (
              <>
                <AcceptFriendship friendship={friendship} isCompact={isCompact} disabled={!!friendship.optimisticId} />
                <DeclineFriendship friendship={friendship} isCompact={isCompact} disabled={!!friendship.optimisticId} />
              </>
            )
      }
    </>
  );
}

interface RemoveFriendshipProps {
  id: string;
  isCompact: boolean;
  disabled: boolean;
}

function RemoveFriendship({ id, isCompact, disabled }: RemoveFriendshipProps) {
  const handleRemove = () => {
    // TODO: Implement friend removal logic here
    console.error('Friend removal not yet implemented for id:', id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isCompact
          ? (
              <Button
                className="cursor-pointer border-1"
                variant="ghost"
                disabled={disabled}
              >
                <UserMinus />
              </Button>
            )
          : (
              <Button
                className="w-25 border-destructive text-destructive/90 hover:bg-destructive/10 focus-visible:ring-destructive/40 cursor-pointer"
                variant="outline"
                disabled={disabled}
                size="sm"
              >
                <span>Unfriend</span>
              </Button>
            )}
      </DialogTrigger>
      <ConfirmationDialog
        title="Are you sure you want to unfriend this user?"
        description="This operation is irreversible."
        onConfirm={handleRemove}
        confirmButtonText="Continue"
        cancelButtonText="Cancel"
      />
    </Dialog>
  );
}

export default FriendshipActions;
