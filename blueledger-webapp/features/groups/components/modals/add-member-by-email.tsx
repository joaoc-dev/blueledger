import type { GroupMembershipDisplay } from '../../schemas';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useLayoutEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { groupMembershipKeys } from '@/constants/query-keys';
import { emailSchema } from '@/features/auth/schemas';
import { validateSchema } from '@/lib/validate-schema';
import { checkMembershipByEmail } from '../../client';
import { GROUP_MEMBERSHIP_STATUS } from '../../constants';
import AddMemberPanel from './add-member-panel';

interface AddMemberByEmailProps {
  currentUserMembership: GroupMembershipDisplay;
  onSuccess: () => void;
  isInviting: boolean;
  setIsInviting: (inviting: boolean) => void;
}

function AddMemberByEmail({ currentUserMembership, onSuccess, isInviting, setIsInviting }: AddMemberByEmailProps) {
  const [email, setEmail] = useState('');
  const [queryEmail, setQueryEmail] = useState('');

  const isValidEmail = useMemo(() => {
    const validationResult = validateSchema(emailSchema, queryEmail);
    return validationResult.success;
  }, [queryEmail]);

  const membershipCheckQuery = useQuery({
    queryKey: groupMembershipKeys.membershipCheck(currentUserMembership.group.id, queryEmail),
    queryFn: () => checkMembershipByEmail(currentUserMembership.group.id, queryEmail),
    enabled: Boolean(queryEmail) && isValidEmail,
    retry: false,
    staleTime: 0, // Always refetch, no caching
    gcTime: 0, // Don't keep in cache
  });

  useLayoutEffect(() => {
    // Reset when component mounts
    setEmail('');
    setQueryEmail('');
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2 w-full">
        <div className="relative w-full">
          <Input
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setQueryEmail(email.trim().toLowerCase());
              }
            }}
          />
        </div>
        <Button
          variant="default"
          onClick={() => setQueryEmail(email.trim().toLowerCase())}
          disabled={!email.trim()}
        >
          <Search />
          <span className="hidden md:block">Search</span>
        </Button>
      </div>
      <div className="min-h-[100px] w-full overflow-hidden flex items-center">
        {(() => {
          if (!queryEmail || !isValidEmail) {
            return <p className="text-sm text-muted-foreground">Enter a valid email address.</p>;
          }

          if (membershipCheckQuery.isFetching || membershipCheckQuery.isLoading) {
            return (
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
              </div>
            );
          }

          if (membershipCheckQuery.isError) {
            return (
              <p className="text-sm text-muted-foreground">
                Unable to check user status. Please try again.
              </p>
            );
          }

          const data = membershipCheckQuery.data;
          if (!data) {
            return (
              <p className="text-sm text-muted-foreground">
                No user found with this email address.
              </p>
            );
          }

          const { membershipStatus, canInvite } = data;

          // If user has a membership that prevents inviting
          if (membershipStatus && !canInvite) {
            switch (membershipStatus) {
              case GROUP_MEMBERSHIP_STATUS.PENDING:
                return (
                  <p className="text-sm text-muted-foreground">
                    This user already has a pending invitation to this group.
                  </p>
                );

              case GROUP_MEMBERSHIP_STATUS.ACCEPTED:
                return (
                  <p className="text-sm text-muted-foreground">
                    This user is already a member of this group.
                  </p>
                );

              default:
                return (
                  <p className="text-sm text-muted-foreground">
                    Unable to determine membership status.
                  </p>
                );
            }
          }

          // User can be invited - show the invite panel
          return <AddMemberPanel user={data.user} currentUserMembership={currentUserMembership} onSuccess={onSuccess} isInviting={isInviting} setIsInviting={setIsInviting} />;
        })()}
      </div>
    </div>
  );
}

export default AddMemberByEmail;
