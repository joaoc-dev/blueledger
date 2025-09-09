import type { GroupMembershipDisplay } from '@/features/groups/schemas';
import AcceptMembership from './accept-membership';
import DeclineMembership from './decline-membership';

interface PendingGroupActionsProps {
  currentUserMembership: GroupMembershipDisplay;
}

export function PendingGroupActions({ currentUserMembership }: PendingGroupActionsProps) {
  return (
    <>
      <AcceptMembership currentUserMembership={currentUserMembership} disabled={!!currentUserMembership.optimisticId} />
      <DeclineMembership currentUserMembership={currentUserMembership} disabled={!!currentUserMembership.optimisticId} />
    </>
  );
}
