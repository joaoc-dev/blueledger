import type { GroupMembershipDisplay } from '../../schemas';
import type { UserDisplay } from '@/features/users/schemas';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RotateCw, UserPlus } from 'lucide-react';
import posthog from 'posthog-js';
import { useLayoutEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import Modal from '@/components/shared/modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { groupMembershipKeys } from '@/constants/query-keys';
import { cn } from '@/lib/utils';
import { getInviteableFriendsForGroup } from '../../client';
import { useGroupMemberships } from '../../hooks/useGroupMemberships';
import AddMemberByEmail from './add-member-by-email';

interface AddMemberModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentUserMembership: GroupMembershipDisplay;
}

// We implement a short minimum delay to avoid snappy UI
async function delayedGetInviteableFriendsForGroup(groupId: string) {
  const [, friendships] = await Promise.all([
    new Promise(resolve => setTimeout(resolve, 800)),
    getInviteableFriendsForGroup(groupId),
  ]);

  return friendships;
}

function AddMemberModal({ isOpen, setIsOpen, currentUserMembership }: AddMemberModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: friendships,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: groupMembershipKeys.invitableFriends(currentUserMembership.group.id!),
    queryFn: () => delayedGetInviteableFriendsForGroup(currentUserMembership.group.id!),
    enabled: isOpen && !!currentUserMembership.group.id,
  });

  const refreshFriends = () => {
    queryClient.refetchQueries({
      queryKey: groupMembershipKeys.invitableFriends(currentUserMembership.group.id!),
    });
  };

  // Filter friends based on search term
  const filteredFriendships = useMemo(() => {
    if (!friendships)
      return [];

    if (!searchTerm.trim())
      return friendships;

    const term = searchTerm.toLowerCase();
    return friendships.filter(friendship =>
      friendship.name?.toLowerCase().includes(term)
      || friendship.email?.toLowerCase().includes(term),
    );
  }, [friendships, searchTerm]);

  useLayoutEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Add member"
      goBackOnClose={false}
    >
      <div className="flex flex-col gap-3 overflow-hidden">
        {/* Search friends */}
        <div className="flex items-center gap-2 w-full">
          <div className="relative w-full">
            <Input
              placeholder="Search friends by name or email"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full"
            />

          </div>
          <Button
            variant="outline"
            onClick={refreshFriends}
            disabled={isLoading}

          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>

        {/* List of friends */}
        <div className="bg-muted/60 rounded-lg px-4 py-2 space-y-3 h-[200px] overflow-y-auto">
          {isLoading
            ? (
                <LoadingFriends />
              )
            : error
              ? (
                  <FailedToLoadFriends />
                )
              : filteredFriendships.length > 0
                ? (
                    <FriendsAvailableForInvite
                      filteredFriendships={filteredFriendships}
                      currentUserMembership={currentUserMembership}
                      isInviting={isInviting}
                      isFetching={isFetching}
                      setIsInviting={setIsInviting}
                    />
                  )
                : (
                    <NoFriendsAvailableForInvite />
                  )}
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Or, invite user by email
          </p>
          <AddMemberByEmail
            currentUserMembership={currentUserMembership}
            onSuccess={handleClose}
            isInviting={isInviting}
            setIsInviting={setIsInviting}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddMemberModal;

function LoadingFriends() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-muted-foreground">
        <p className="text-sm">Loading friends...</p>
      </div>
    </div>
  );
}

function FailedToLoadFriends() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-muted-foreground">
        <p className="text-sm font-medium">Failed to load friends</p>
      </div>
    </div>
  );
}

interface FriendsAvailableForInviteProps {
  filteredFriendships: UserDisplay[];
  currentUserMembership: GroupMembershipDisplay;
  isInviting: boolean;
  isFetching: boolean;
  setIsInviting: (inviting: boolean) => void;
}

function FriendsAvailableForInvite({ filteredFriendships, currentUserMembership, isInviting, setIsInviting, isFetching }: FriendsAvailableForInviteProps) {
  const { inviteMemberMutation } = useGroupMemberships();

  const handleInvite = async (friendship: UserDisplay) => {
    if (!friendship.email)
      return;

    try {
      setIsInviting(true);

      posthog.capture(AnalyticsEvents.GROUP_FRIEND_INVITE_CLICKED, {
        groupId: currentUserMembership.group.id!,
        membershipId: currentUserMembership.id!,
        friendshipEmail: friendship.email,
        action: 'send_group_invite',
      });

      toast.loading('Sending group invite...', {
        id: friendship.id,
      });

      await inviteMemberMutation.mutateAsync({
        groupId: currentUserMembership.group.id!,
        email: friendship.email,
        friendName: friendship.name || friendship.email,
      });

      toast.success('Invite sent', {
        id: friendship.id,
      });
    }
    catch (error) {
      console.error('Failed to send invite:', error);
      toast.error('Failed to send invite', {
        id: friendship.id,
      });
    }
    finally {
      setIsInviting(false);
    }
  };

  return (
    <div className={cn(isFetching && 'opacity-50')}>
      {filteredFriendships.map(friendship => (
        <div key={friendship.id} className="flex items-center justify-between gap-2 border-b pb-2">
          <div className="flex items-center gap-3 truncate">
            <Avatar className="h-8 w-8">
              <AvatarImage src={friendship.image || ''} alt={friendship.name} />
              <AvatarFallback className="text-xs">{friendship.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate">{friendship.name}</span>
              <span className="text-xs text-muted-foreground truncate">
                {friendship.email}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={isInviting || isFetching}
            onClick={() => handleInvite(friendship)}
          >

            <UserPlus />
          </Button>
        </div>
      ))}
    </div>
  );
}

function NoFriendsAvailableForInvite() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-muted-foreground">
        <p className="text-sm font-medium">No friends available for invite</p>
      </div>
    </div>
  );
}
