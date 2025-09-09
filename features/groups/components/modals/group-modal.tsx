import type { GroupMembershipDisplay } from '../../schemas';
import Modal from '@/components/shared/modal';
import GroupForm from '../group-form';

interface GroupModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentUserMembership?: GroupMembershipDisplay;
}

function GroupModal({ isOpen, setIsOpen, currentUserMembership }: GroupModalProps) {
  const isUpdate = !!currentUserMembership?.group.id;

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title={isUpdate ? 'Edit group' : 'Create group'}
      goBackOnClose={false}
    >
      <GroupForm
        currentUserMembership={currentUserMembership}
        onSubmit={handleClose}
      />
    </Modal>
  );
}

export default GroupModal;
