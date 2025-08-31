import type { GroupMembershipDisplay } from '../../schemas';
import Modal from '@/components/shared/modal';
import GroupForm from '../group-form';

interface GroupModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  group?: GroupMembershipDisplay;
}

function GroupModal({ isOpen, setIsOpen, group }: GroupModalProps) {
  const isUpdate = !!group?.group.id;

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
        group={group}
        onSubmit={handleClose}
      />
    </Modal>
  );
}

export default GroupModal;
