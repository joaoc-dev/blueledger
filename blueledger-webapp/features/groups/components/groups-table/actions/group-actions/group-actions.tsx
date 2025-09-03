import type { GroupMembershipDisplay } from '@/features/groups/schemas';
import { Crown, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GROUP_ROLES } from '@/features/groups/constants';
import AddMember from './add-member';
import DeleteGroup from './delete-group';
import EditGroup from './edit-group';
import LeaveGroup from './leave-group';
import ManageMembers from './manage-members';
import TransferOwnership from './transfer-ownership';
import ViewMembers from './view-members';

interface GroupActionsProps {
  currentUserMembership: GroupMembershipDisplay;
  disabled: boolean;
  onEditGroup?: () => void;
  onAddMember?: () => void;
  onManageMembers?: () => void;
  onTransferOwnership?: () => void;
  onViewMembers?: () => void;
  onDeleteGroup?: () => void;
  onLeaveGroup?: () => void;
}

export function GroupActions({
  currentUserMembership,
  disabled,
  onEditGroup,
  onAddMember,
  onManageMembers,
  onTransferOwnership,
  onViewMembers,
  onDeleteGroup,
  onLeaveGroup,
}: GroupActionsProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Safety check for null/undefined membership
  if (!currentUserMembership || !currentUserMembership.role) {
    return null;
  }

  const isOwner = currentUserMembership.role === GROUP_ROLES.OWNER;
  const menuItemClass = 'flex w-full items-center gap-2 px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm cursor-pointer transition-colors';

  const handleAction = (action?: () => void) => {
    setPopoverOpen(false); // Close popover immediately
    action?.(); // Call the action handler if it exists
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          className="cursor-pointer border-1 relative"
          variant="ghost"
          disabled={disabled}
        >
          <MoreHorizontal />
          {isOwner && <Crown className="absolute -top-1 -right-1 w-3 h-3 text-amber-600" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-1"
        side="bottom"
        align="end"
        sideOffset={8}

      >
        <div className="space-y-1">
          {isOwner
            ? (
                <>
                  <EditGroup
                    currentUserMembership={currentUserMembership}
                    className={menuItemClass}
                    onClick={() => handleAction(onEditGroup)}
                  />
                  <AddMember
                    className={menuItemClass}
                    onClick={() => handleAction(onAddMember)}
                  />
                  <ManageMembers
                    currentUserMembership={currentUserMembership}
                    className={menuItemClass}
                    onClick={() => handleAction(onManageMembers)}
                  />
                  <TransferOwnership
                    className={menuItemClass}
                    onClick={() => handleAction(onTransferOwnership)}
                  />
                  <DeleteGroup
                    className={menuItemClass}
                    onClick={() => handleAction(onDeleteGroup)}
                  />
                </>
              )
            : (
                <>
                  <ViewMembers
                    className={menuItemClass}
                    onClick={() => handleAction(onViewMembers)}
                  />
                  <LeaveGroup
                    className={menuItemClass}
                    onClick={() => handleAction(onLeaveGroup)}
                  />
                </>
              )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
