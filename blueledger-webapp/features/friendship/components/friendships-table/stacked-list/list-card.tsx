import type { FriendshipDisplay } from '@/features/friendship/schemas';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FRIENDSHIP_STATUS } from '@/features/friendship/constants';
import FriendshipActions from '../friendship-actions/friendship-actions';

interface ListCardProps {
  friendship: FriendshipDisplay;
}

function ListCard({ friendship }: ListCardProps) {
  const isFriend = friendship.status === FRIENDSHIP_STATUS.ACCEPTED;
  const isPending = friendship.status === FRIENDSHIP_STATUS.PENDING;

  const friendName = friendship.friend?.name || 'Unknown user';
  const friendEmail = friendship.friend?.email || 'No email';
  const friendImage = friendship.friend?.image || undefined;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between rounded-md border bg-muted/60 p-3 w-full h-25">
        <div className="grid grid-cols-[auto_1fr] items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={friendImage} alt={friendName} />
            <AvatarFallback>{friendName.charAt(0)?.toUpperCase() ?? 'U'}</AvatarFallback>
          </Avatar>
          <div className="leading-tight min-w-0 flex flex-col gap-2">
            <div>
              <div className="text-sm font-medium truncate">{friendName}</div>
              <div className="text-xs text-muted-foreground truncate">{friendEmail}</div>
            </div>

            <div className="text-xs text-muted-foreground">
              <div className="text-xs text-muted-foreground">
                {isFriend && `Since ${friendship.acceptedAt?.toLocaleDateString()}`}
                {isPending && `Sent ${friendship.createdAt.toLocaleDateString()}`}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 h-full ml-4">
          <FriendshipActions friendship={friendship} isCompact={true} />
        </div>
      </div>
    </div>
  );
}

export default ListCard;
