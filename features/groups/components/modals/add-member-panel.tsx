import type { GroupMembershipDisplay } from '../../schemas';
import type { UserDisplay } from '@/features/users/schemas';
import { UserPlus } from 'lucide-react';
import posthog from 'posthog-js';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { GROUP_ROLES } from '../../constants';
import { useGroupMemberships } from '../../hooks/useGroupMemberships';

interface AddMemberPanelProps {
  user: UserDisplay;
  currentUserMembership: GroupMembershipDisplay;
  onSuccess: () => void;
  isInviting: boolean;
  setIsInviting: (inviting: boolean) => void;
}

function AddMemberPanel({ user, currentUserMembership, onSuccess, isInviting, setIsInviting }: AddMemberPanelProps) {
  const { inviteMemberMutation } = useGroupMemberships();

  const isSelf = user.isSelf;
  // Note: Membership validation is already handled by add-member-by-email.tsx
  // Only need to check if user is trying to invite themselves
  const isCurrentUserOwner = currentUserMembership.role === GROUP_ROLES.OWNER;

  const isDisabled = isSelf || !isCurrentUserOwner;
  const statusText = isSelf
    ? 'You cannot invite yourself to the group.'
    : !isCurrentUserOwner
        ? 'Only group owners can send invites.'
        : 'Invite user to group.';

  const handleInviteMember = async () => {
    if (!user.email)
      return;

    try {
      setIsInviting(true);

      posthog.capture(AnalyticsEvents.GROUP_FRIEND_INVITE_CLICKED, {
        groupId: currentUserMembership.group.id!,
        membershipId: currentUserMembership.id!,
        friendshipEmail: user.email,
        action: 'send_group_invite',
      });

      toast.loading('Sending group invite...', {
        id: user.id,
      });

      await inviteMemberMutation.mutateAsync({
        groupId: currentUserMembership.group.id!,
        email: user.email,
        friendName: user.name || user.email,
      });

      onSuccess();

      toast.success('Invite sent', {
        id: user.id,
      });
    }
    catch (error) {
      console.error('Failed to send invite:', error);
      toast.error('Failed to send invite', {
        id: user.id,
      });
    }
    finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {isDisabled && (
        <div className="text-sm text-muted-foreground">{statusText}</div>
      )}
      <div className="flex items-center justify-between rounded-md border bg-muted/60 p-3 w-full">
        <div className="grid grid-cols-[auto_1fr] items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image || undefined} alt={user.name || user.email} />
            <AvatarFallback>{(user.name || user.email)?.charAt(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="leading-tight min-w-0 flex-1">
            <div className="text-sm font-medium truncate">{user.name || 'Unnamed user'}</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
        </div>
        <Button
          size="sm"
          onClick={handleInviteMember}
          disabled={isDisabled || isInviting || inviteMemberMutation.isPending}
        >
          <UserPlus />
          <span className="hidden md:block">
            {inviteMemberMutation.isPending ? 'Inviting...' : 'Invite'}
          </span>
        </Button>
      </div>
    </div>
  );
}

export default AddMemberPanel;
