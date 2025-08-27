'use client';

import type { FriendshipDisplay } from '@/features/friendship/schemas';
import { FRIENDSHIP_STATUS } from '../../../constants';
import AcceptFriendship from './accept-friendship';
import CancelFriendship from './cancel-friendship';
import DeclineFriendship from './decline-friendship';
import RemoveFriendship from './remove-friendship';

interface ItemOptionsProps {
  friendship: FriendshipDisplay;
  isCompact?: boolean;
}

function FriendshipActions({ friendship, isCompact = false }: ItemOptionsProps) {
  const isActiveFriendship = friendship.status === FRIENDSHIP_STATUS.ACCEPTED;

  if (isActiveFriendship) {
    return <RemoveFriendship friendship={friendship} isCompact={isCompact} disabled={!!friendship.optimisticId} />;
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

export default FriendshipActions;
