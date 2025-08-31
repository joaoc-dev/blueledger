import type { GroupMembershipDisplay } from '@/features/groups/schemas';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GROUP_MEMBERSHIP_STATUS } from '@/features/groups/constants';
import { GroupActions } from '../actions/group-actions';
import { PendingGroupActions } from '../actions/pending-group-actions/pending-group-actions';

interface ListCardProps {
  groupMembership: GroupMembershipDisplay;
}

function ListCard({ groupMembership }: ListCardProps) {
  const isPending = groupMembership.status === GROUP_MEMBERSHIP_STATUS.PENDING;
  const isAccepted = groupMembership.status === GROUP_MEMBERSHIP_STATUS.ACCEPTED;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between rounded-md border bg-muted/60 p-3 w-full h-25">
        <div className="grid grid-cols-[auto_1fr] items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={groupMembership.group?.image || ''} alt={groupMembership.group?.name || ''} />
            <AvatarFallback>{groupMembership.group?.name?.charAt(0)?.toUpperCase() ?? 'U'}</AvatarFallback>
          </Avatar>
          <div className="leading-tight min-w-0 flex flex-col gap-2">
            <div>
              <div className="text-sm font-medium truncate">{groupMembership.group?.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                Members:
                {' '}
                {groupMembership.group?.memberCount}
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              <div className="text-xs text-muted-foreground truncate">
                {isPending && `Sent on ${groupMembership.createdAt.toLocaleDateString()}`}
                {isAccepted && `Since ${groupMembership.acceptedAt?.toLocaleDateString()}`}
                {isPending && groupMembership.invitedByName && (
                  <div>
                    By
                    {' '}
                    {groupMembership.invitedByName}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {isPending
          ? (
              <div className="flex flex-col items-center justify-center gap-3 h-full ml-4">
                <PendingGroupActions groupMembership={groupMembership} disabled={false} />
              </div>
            )
          : (
              <GroupActions groupMembership={groupMembership} disabled={false} />
            )}
      </div>
    </div>
  );
}

export default ListCard;
