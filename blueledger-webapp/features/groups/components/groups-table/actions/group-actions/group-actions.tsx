import type { GroupMembershipDisplay } from '@/features/groups/schemas';
import { Crown, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { GROUP_ROLES } from '@/features/groups/constants';
import AddMember from './add-member';
import DeleteGroup from './delete-group';
import EditGroup from './edit-group';
import LeaveGroup from './leave-group';
import ManageMembers from './manage-members';
import TransferOwnership from './transfer-ownership';
import ViewMembers from './view-members';

interface GroupActionsProps {
  groupMembership: GroupMembershipDisplay;
  disabled: boolean;
}

export function GroupActions({ groupMembership, disabled }: GroupActionsProps) {
  // We keep the dropdown logically open while a modal is open to avoid mobile keyboards
  // pushing the underlying dropdown. We hide it visually (but keep it mounted) so focus
  // and layout don't jump. On modal close, we close the menu and then allow unmount.
  const [menuOpen, setMenuOpen] = useState(false);
  const [keepMountedWhileModalOpen, setKeepMountedWhileModalOpen] = useState(false);

  const isOwner = groupMembership.role === GROUP_ROLES.OWNER;
  const dropdownMenuItemClass = 'h-10 text-lg md:h-9 md:text-sm';

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            className="cursor-pointer border-1 relative"
            variant="ghost"
            disabled={disabled}
          >
            <MoreHorizontal />
            <Crown className="absolute -top-1 -right-1 w-3 h-3 text-amber-600" />
          </Button>
        </DropdownMenuTrigger>
        {/* Keep content mounted while modal is open (hidden to prevent flicker/keyboard push). */}
        <DropdownMenuContent
          {...(keepMountedWhileModalOpen ? { forceMount: true } : {})}
          className={
            (keepMountedWhileModalOpen || !menuOpen)
              ? 'w-(--radix-dropdown-menu-trigger-width) min-w-56 invisible opacity-0 pointer-events-none'
              : 'w-(--radix-dropdown-menu-trigger-width) min-w-56'
          }
          side="bottom"
          align="end"
          sideOffset={8}
        >
          <DropdownMenuGroup>
            {isOwner
              ? (
                  <>
                    <DropdownMenuItem asChild>
                      <EditGroup
                        groupMembership={groupMembership}
                        className={dropdownMenuItemClass}
                        onModalOpen={() => {
                          setKeepMountedWhileModalOpen(true);
                        }}
                        onModalClose={() => {
                          setMenuOpen(false);
                          setTimeout(() => setKeepMountedWhileModalOpen(false), 200);
                        }}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <ManageMembers
                        groupMembership={groupMembership}
                        className={dropdownMenuItemClass}
                        onModalOpen={() => {
                          setKeepMountedWhileModalOpen(true);
                        }}
                        onModalClose={() => {
                          setMenuOpen(false);
                          setTimeout(() => setKeepMountedWhileModalOpen(false), 200);
                        }}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <AddMember
                        groupMembership={groupMembership}
                        className={dropdownMenuItemClass}
                        onModalOpen={() => {
                          setKeepMountedWhileModalOpen(true);
                        }}
                        onModalClose={() => {
                          setMenuOpen(false);
                          setTimeout(() => setKeepMountedWhileModalOpen(false), 200);
                        }}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <TransferOwnership
                        groupMembership={groupMembership}
                        className={dropdownMenuItemClass}
                        onModalOpen={() => {
                          setKeepMountedWhileModalOpen(true);
                        }}
                        onModalClose={() => {
                          setMenuOpen(false);
                          setTimeout(() => setKeepMountedWhileModalOpen(false), 200);
                        }}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <DeleteGroup
                        groupMembership={groupMembership}
                        className={dropdownMenuItemClass}
                        onModalOpen={() => {
                          setKeepMountedWhileModalOpen(true);
                        }}
                        onModalClose={() => {
                          setMenuOpen(false);
                          setTimeout(() => setKeepMountedWhileModalOpen(false), 200);
                        }}
                      />
                    </DropdownMenuItem>
                  </>
                )
              : (
                  <>
                    <DropdownMenuItem asChild>
                      <ViewMembers
                        groupMembership={groupMembership}
                        className={dropdownMenuItemClass}
                        onModalOpen={() => {
                          setKeepMountedWhileModalOpen(true);
                        }}
                        onModalClose={() => {
                          setMenuOpen(false);
                          setTimeout(() => setKeepMountedWhileModalOpen(false), 200);
                        }}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <LeaveGroup
                        groupMembership={groupMembership}
                        className={dropdownMenuItemClass}
                        onModalOpen={() => {
                          setKeepMountedWhileModalOpen(true);
                        }}
                        onModalClose={() => {
                          setMenuOpen(false);
                          setTimeout(() => setKeepMountedWhileModalOpen(false), 200);
                        }}
                      />
                    </DropdownMenuItem>
                  </>
                )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
