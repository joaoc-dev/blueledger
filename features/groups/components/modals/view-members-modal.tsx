import type { GroupMembershipDisplay } from '../../schemas';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/shared/modal';
import { groupMembershipKeys } from '@/constants/query-keys';
import { getGroupMemberships } from '../../client';
import { GROUP_MEMBERSHIP_STATUS } from '../../constants';
import MemberList from './member-list/member-list';

// We implement a short minimum delay to avoid snappy UI
async function delayedGetGroupMemberships(groupId: string) {
  const [, memberships] = await Promise.all([
    new Promise(resolve => setTimeout(resolve, 800)),
    getGroupMemberships(groupId),
  ]);

  return memberships.filter(m => m.status === GROUP_MEMBERSHIP_STATUS.ACCEPTED);
}

interface ViewMembersModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentUserMembership: GroupMembershipDisplay;
}

function ViewMembersModal({ isOpen, setIsOpen, currentUserMembership }: ViewMembersModalProps) {
  const {
    data: groupMembers,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: groupMembershipKeys.membershipsView(currentUserMembership.group.id!),
    queryFn: () => delayedGetGroupMemberships(currentUserMembership.group.id!),
    enabled: isOpen,
  });

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Members"
      goBackOnClose={false}
    >
      <MemberList
        memberships={groupMembers || []}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        currentUserMembership={currentUserMembership}
        mode="view"
      />
    </Modal>
  );
}

export default ViewMembersModal;
