import type { GroupMembershipDisplay } from '@/features/groups/schemas';
import { useState } from 'react';
import AddMemberModal from '@/features/groups/components/modals/add-member-modal';
import DeleteGroupModal from '@/features/groups/components/modals/delete-group-modal';
import GroupModal from '@/features/groups/components/modals/group-modal';
import LeaveGroupModal from '@/features/groups/components/modals/leave-group-modal';
import ManageMembersModal from '@/features/groups/components/modals/manage-members-modal';
import TransferOwnershipModal from '@/features/groups/components/modals/transfer-ownership-modal';
import ViewMembersModal from '@/features/groups/components/modals/view-members-modal';
import { GroupActions } from './group-actions';

/**
 * GroupActionsWithModals - Wrapper component that manages modal state for GroupActions
 */

interface GroupActionsWithModalsProps {
  currentUserMembership: GroupMembershipDisplay;
  disabled: boolean;
}

function GroupActionsWithModals({ currentUserMembership, disabled }: GroupActionsWithModalsProps) {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [showLeaveGroupModal, setShowLeaveGroupModal] = useState(false);
  const [showManageMembersModal, setShowManageMembersModal] = useState(false);
  const [showTransferOwnershipModal, setShowTransferOwnershipModal] = useState(false);
  const [showViewMembersModal, setShowViewMembersModal] = useState(false);

  const handleAddMember = () => setShowAddMemberModal(true);
  const handleDeleteGroup = () => setShowDeleteGroupModal(true);
  const handleEditGroup = () => setShowEditGroupModal(true);
  const handleLeaveGroup = () => setShowLeaveGroupModal(true);
  const handleManageMembers = () => setShowManageMembersModal(true);
  const handleTransferOwnership = () => setShowTransferOwnershipModal(true);
  const handleViewMembers = () => setShowViewMembersModal(true);

  return (
    <>
      <GroupActions
        currentUserMembership={currentUserMembership}
        disabled={disabled}
        onEditGroup={handleEditGroup}
        onAddMember={handleAddMember}
        onManageMembers={handleManageMembers}
        onTransferOwnership={handleTransferOwnership}
        onViewMembers={handleViewMembers}
        onDeleteGroup={handleDeleteGroup}
        onLeaveGroup={handleLeaveGroup}
      />

      {/* Modals */}
      {showAddMemberModal && (
        <AddMemberModal
          isOpen={showAddMemberModal}
          setIsOpen={setShowAddMemberModal}
          currentUserMembership={currentUserMembership}
        />
      )}

      {showDeleteGroupModal && (
        <DeleteGroupModal
          isOpen={showDeleteGroupModal}
          setIsOpen={setShowDeleteGroupModal}
          currentUserMembership={currentUserMembership}
        />
      )}

      {showEditGroupModal && (
        <GroupModal
          isOpen={showEditGroupModal}
          setIsOpen={setShowEditGroupModal}
          currentUserMembership={currentUserMembership}
        />
      )}

      {showLeaveGroupModal && (
        <LeaveGroupModal
          isOpen={showLeaveGroupModal}
          setIsOpen={setShowLeaveGroupModal}
          currentUserMembership={currentUserMembership}
        />
      )}

      {showManageMembersModal && (
        <ManageMembersModal
          isOpen={showManageMembersModal}
          setIsOpen={setShowManageMembersModal}
          currentUserMembership={currentUserMembership}
        />
      )}

      {showTransferOwnershipModal && (
        <TransferOwnershipModal
          isOpen={showTransferOwnershipModal}
          setIsOpen={setShowTransferOwnershipModal}
          currentUserMembership={currentUserMembership}
        />
      )}

      {showViewMembersModal && (
        <ViewMembersModal
          isOpen={showViewMembersModal}
          setIsOpen={setShowViewMembersModal}
          currentUserMembership={currentUserMembership}
        />
      )}
    </>
  );
}

export default GroupActionsWithModals;
