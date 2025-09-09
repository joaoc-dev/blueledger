import { Clock, Crown } from 'lucide-react';
import { GROUP_MEMBERSHIP_STATUS } from '../../constants';

interface MembershipStatusOverlayProps {
  status: string;
  isOwner: boolean;
}

export function MembershipStatusOverlay({ status, isOwner }: MembershipStatusOverlayProps) {
  if (isOwner) {
    return (
      <div className="absolute -top-2 -right-1">
        <Crown className="w-4 h-4 text-amber-600" />
      </div>
    );
  }
  else if (status === GROUP_MEMBERSHIP_STATUS.PENDING) {
    return (
      <div className="absolute -bottom-1 -right-1 rounded-full p-0.5 bg-yellow-600">
        <Clock className="h-2.5 w-2.5 text-white" />
      </div>
    );
  }

  return null;
}
