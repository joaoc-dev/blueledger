import type { GroupMembershipDisplay } from '@/features/groups/schemas';
import AcceptMembership from './accept-membership';
import DeclineMembership from './decline-membership';

interface PendingGroupActionsProps {
  groupMembership: GroupMembershipDisplay;
}

export function PendingGroupActions({ groupMembership }: PendingGroupActionsProps) {
  return (
    <>
      <AcceptMembership groupMembership={groupMembership} disabled={!!groupMembership.optimisticId} />
      <DeclineMembership groupMembership={groupMembership} disabled={!!groupMembership.optimisticId} />
    </>
  );
}
