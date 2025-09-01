import type { GroupMembershipDisplay } from '@/features/groups/schemas';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GROUP_MEMBERSHIP_STATUS } from '@/features/groups/constants';
import { GroupActions } from '../actions/group-actions';
import { PendingGroupActions } from '../actions/pending-group-actions';

interface ListCardProps {
  currentUserMembership: GroupMembershipDisplay;
}

function ListCard({ currentUserMembership }: ListCardProps) {
  const isPending = currentUserMembership.status === GROUP_MEMBERSHIP_STATUS.PENDING;
  const isAccepted = currentUserMembership.status === GROUP_MEMBERSHIP_STATUS.ACCEPTED;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between rounded-md border bg-muted/60 p-3 w-full h-25">
        <div className="grid grid-cols-[auto_1fr] items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={currentUserMembership.group?.image || ''}
              alt={currentUserMembership.group?.name || ''}
            />
            <AvatarFallback>{currentUserMembership.group?.name?.charAt(0)?.toUpperCase() ?? 'U'}</AvatarFallback>
          </Avatar>
          <div className="leading-tight min-w-0 flex flex-col gap-2">
            <div>
              <div className="text-sm font-medium truncate">{currentUserMembership.group?.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                Members:
                {' '}
                {currentUserMembership.group?.memberCount}
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              <div className="text-xs text-muted-foreground truncate">
                {isPending && `Sent on ${currentUserMembership.createdAt.toLocaleDateString()}`}
                {isAccepted && `Since ${currentUserMembership.acceptedAt?.toLocaleDateString()}`}
                {isPending && currentUserMembership.invitedByName && (
                  <div>
                    By
                    {' '}
                    {currentUserMembership.invitedByName}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {isPending
          ? (
              <div className="flex flex-col items-center justify-center gap-3 h-full ml-4">
                <PendingGroupActions currentUserMembership={currentUserMembership} />
              </div>
            )
          : (
              <GroupActions currentUserMembership={currentUserMembership} disabled={false} />
            )}
      </div>
    </div>
  );
}

export default ListCard;
