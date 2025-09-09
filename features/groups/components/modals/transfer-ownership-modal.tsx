import type { GroupMembershipDisplay } from '../../schemas';
import { useQuery } from '@tanstack/react-query';
import React, { useLayoutEffect } from 'react';
import Modal from '@/components/shared/modal';
import { groupMembershipKeys } from '@/constants/query-keys';
import { getGroupMemberships } from '../../client';
import { GROUP_MEMBERSHIP_STATUS } from '../../constants';
import MemberList from './member-list/member-list';

async function getGroupMembersForTransfer(groupId: string): Promise<GroupMembershipDisplay[]> {
  const [, memberships] = await Promise.all([
    new Promise(resolve => setTimeout(resolve, 300)),
    getGroupMemberships(groupId),
  ]);

  const acceptedMembers = memberships
    .filter(membership => membership.status === GROUP_MEMBERSHIP_STATUS.ACCEPTED);

  return acceptedMembers;
}

interface TransferOwnershipModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentUserMembership: GroupMembershipDisplay;
}

function TransferOwnershipModal({ isOpen, setIsOpen, currentUserMembership }: TransferOwnershipModalProps) {
  const {
    data: groupMembers,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: groupMembershipKeys.membershipsTransfer(currentUserMembership.group.id),
    queryFn: () => getGroupMembersForTransfer(currentUserMembership.group.id),
  });

  useLayoutEffect(() => {
    // Reset any state when modal opens
  }, [isOpen]);

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Transfer Ownership"
      goBackOnClose={false}
    >
      <MemberList
        memberships={groupMembers || []}
        isFetching={isFetching}
        currentUserMembership={currentUserMembership}
        isLoading={isLoading}
        error={error}
        mode="transfer"
        onTransfer={() => setIsOpen(false)}
      />
    </Modal>
  );
}

export default TransferOwnershipModal;
