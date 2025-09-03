import type { GroupMembershipDisplay } from '../../../schemas';
import { useQueryClient } from '@tanstack/react-query';
import { RotateCw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui-modified/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { groupMembershipKeys } from '@/constants/query-keys';
import { cn } from '@/lib/utils';
import { GROUP_MEMBERSHIP_STATUS, GROUP_ROLES } from '../../../constants';
import { MembershipStatusOverlay } from '../membership-status-overlay';
import CancelInvite from './cancel-invite';
import KickMember from './kick-member';
import TransferOwnership from './transfer-ownership';

interface MemberListProps {
  memberships: GroupMembershipDisplay[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  currentUserMembership: GroupMembershipDisplay;
  mode: 'manage' | 'transfer' | 'view';
  onTransfer?: () => void;
}

function MemberList({
  memberships,
  isLoading,
  isFetching,
  error,
  currentUserMembership,
  mode,
  onTransfer,
}: MemberListProps) {
  const [isOperationInProgress, setIsOperationInProgress] = useState(false);
  const queryClient = useQueryClient();

  const refreshMembers = () => {
    switch (mode) {
      case 'manage':
        queryClient.refetchQueries({
          queryKey: groupMembershipKeys.membershipsManagement(currentUserMembership.group.id),
        });
        break;

      case 'transfer':
        queryClient.refetchQueries({
          queryKey: groupMembershipKeys.membershipsTransfer(currentUserMembership.group.id),
        });
        break;

      case 'view':
        queryClient.refetchQueries({
          queryKey: groupMembershipKeys.membershipsView(currentUserMembership.group.id),
        });
        break;
    }
  };

  return (
    <>
      <div className="flex flex-col gap-1 overflow-hidden text-sm text-muted-foreground">
        <p className="truncate">
          {currentUserMembership.group.name}
        </p>
        <div className="flex items-center justify-between w-full">
          {isLoading
            ? (
                'Loading members...'
              )
            : (
                <span className="text-xs">
                  {`${memberships?.length || 0} member${(memberships?.length || 0) !== 1 ? 's' : ''}`}
                </span>
              )}
          <Button variant="outline" size="sm" onClick={refreshMembers}>
            <RotateCw />
          </Button>
        </div>

      </div>
      <div className={cn('border rounded-lg overflow-hidden h-[400px] overflow-y-auto', isFetching && 'opacity-50')}>
        {isLoading
          ? (
              <LoadingMembers />
            )
          : error
            ? (
                <FailedToLoadMembers />
              )
            : memberships.length > 0
              ? (
                  <List
                    memberships={memberships}
                    mode={mode}
                    onTransfer={onTransfer}
                    isOperationInProgress={isOperationInProgress}
                    setIsOperationInProgress={setIsOperationInProgress}
                  />
                )
              : (
                  <NoMembers />
                )}
      </div>
    </>
  );
}

export default MemberList;

function LoadingMembers() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-muted-foreground">
        <p className="text-sm font-medium">Loading members...</p>
      </div>
    </div>
  );
}

function FailedToLoadMembers() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-muted-foreground">
        <p className="text-sm font-medium">Failed to load members</p>
      </div>
    </div>
  );
}

function NoMembers() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-muted-foreground">
        <p className="text-sm font-medium">No members found</p>
      </div>
    </div>
  );
}

interface ListProps {
  memberships: GroupMembershipDisplay[];
  mode: 'manage' | 'transfer' | 'view';
  onTransfer?: () => void;
  isOperationInProgress: boolean;
  setIsOperationInProgress: (inProgress: boolean) => void;
}

function List({ memberships, mode, onTransfer, isOperationInProgress, setIsOperationInProgress }: ListProps) {
  // Sort members consistently: owner first, then accepted members, then pending invites
  const sortedMemberships = [...memberships].sort((a, b) => {
    // Owner always comes first
    if (a.role === GROUP_ROLES.OWNER && b.role !== GROUP_ROLES.OWNER)
      return -1;
    if (a.role !== GROUP_ROLES.OWNER && b.role === GROUP_ROLES.OWNER)
      return 1;

    // Then accepted members
    if (a.status === GROUP_MEMBERSHIP_STATUS.ACCEPTED && b.status !== GROUP_MEMBERSHIP_STATUS.ACCEPTED)
      return -1;
    if (a.status !== GROUP_MEMBERSHIP_STATUS.ACCEPTED && b.status === GROUP_MEMBERSHIP_STATUS.ACCEPTED)
      return 1;

    // Then pending invites
    if (a.status === GROUP_MEMBERSHIP_STATUS.PENDING && b.status !== GROUP_MEMBERSHIP_STATUS.PENDING)
      return -1;
    if (a.status !== GROUP_MEMBERSHIP_STATUS.PENDING && b.status === GROUP_MEMBERSHIP_STATUS.PENDING)
      return 1;

    // Keep original order for same status
    return 0;
  });

  return (
    <div className="divide-y">
      {sortedMemberships.map((membership) => {
        return (
          <div key={membership.id} className="p-4 hover:bg-muted/50">
            <div className="flex items-center justify-between gap-4">
              {/* col-1 */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={membership.user?.image || ''} alt={membership.user?.name || ''} />
                    <AvatarFallback>{membership.user?.name?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <MembershipStatusOverlay
                    status={membership.status}
                    isOwner={membership.role === GROUP_ROLES.OWNER}
                  />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="truncate font-medium">
                    {membership.user?.name || 'Unknown'}
                  </span>
                  {membership.role !== GROUP_ROLES.OWNER && (
                    <span className="text-xs text-muted-foreground">
                      {membership.status === GROUP_MEMBERSHIP_STATUS.ACCEPTED
                        ? `Member since ${new Date(membership.createdAt).toLocaleDateString()}`
                        : membership.status === GROUP_MEMBERSHIP_STATUS.PENDING
                          ? `Invite sent ${new Date(membership.createdAt).toLocaleDateString()}`
                          : membership.status}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex gap-2">
                  {mode === 'manage' && membership.role !== GROUP_ROLES.OWNER
                    && (
                      <>
                        {/* Cancel pending invites */}
                        {membership.status === GROUP_MEMBERSHIP_STATUS.PENDING
                          && membership.id && (
                          <CancelInvite
                            groupId={membership.group.id}
                            membershipId={membership.id!}
                            memberEmail={membership.user?.email || ''}
                            isOperationInProgress={isOperationInProgress}
                            setIsOperationInProgress={setIsOperationInProgress}
                          />
                        )}

                        {/* Remove accepted members */}
                        {membership.status === GROUP_MEMBERSHIP_STATUS.ACCEPTED
                          && membership.id && (
                          <KickMember
                            groupId={membership.group.id}
                            membershipId={membership.id!}
                            memberName={membership.user?.name || 'Unknown'}
                            isOperationInProgress={isOperationInProgress}
                            setIsOperationInProgress={setIsOperationInProgress}
                          />
                        )}
                      </>
                    )}

                  {mode === 'transfer' && membership.role !== GROUP_ROLES.OWNER
                    && membership.status === GROUP_MEMBERSHIP_STATUS.ACCEPTED
                    && membership.id && (
                    <TransferOwnership
                      groupId={membership.group.id}
                      membershipId={membership.id!}
                      memberName={membership.user?.name || 'Unknown'}
                      onTransfer={onTransfer}
                      isOperationInProgress={isOperationInProgress}
                      setIsOperationInProgress={setIsOperationInProgress}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
