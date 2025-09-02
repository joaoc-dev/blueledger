import type { GroupMembershipDisplay } from '../../schemas';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RotateCw } from 'lucide-react';
import Modal from '@/components/shared/modal';
import { Button } from '@/components/ui/button';
import { groupMembershipKeys } from '@/constants/query-keys';
import { getGroupMemberships } from '../../client';
import MemberList from './member-list/member-list';

// We implement a short minimum delay to avoid snappy UI
async function delayedGetGroupMemberships(groupId: string) {
  const [, memberships] = await Promise.all([
    new Promise(resolve => setTimeout(resolve, 800)),
    getGroupMemberships(groupId),
  ]);

  return memberships;
}

interface ManageMembersModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentUserMembership: GroupMembershipDisplay;
}

function ManageMembersModal({ isOpen, setIsOpen, currentUserMembership }: ManageMembersModalProps) {
  const {
    data: groupMembers,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: groupMembershipKeys.membershipsManagement(currentUserMembership.group.id),
    queryFn: () => delayedGetGroupMemberships(currentUserMembership.group.id),
  });

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Manage members"
      goBackOnClose={false}
    >
      <MemberList
        memberships={groupMembers || []}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        currentUserMembership={currentUserMembership}
        mode="manage"
      />
    </Modal>
  );
}

export default ManageMembersModal;
