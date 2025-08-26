import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useLayoutEffect, useMemo, useState } from 'react';
import Modal from '@/components/shared/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { emailSchema } from '@/features/auth/schemas';
import { lookupUserByEmail } from '@/features/users/client';
import { validateSchema } from '@/lib/validate-schema';
import AddFriendPanel from './add-friend-panel';

interface FriendRequestModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function AddFriendModal({ isOpen, setIsOpen }: FriendRequestModalProps) {
  const [email, setEmail] = useState('');
  const [queryEmail, setQueryEmail] = useState('');

  const isValidEmail = useMemo(() => {
    const validationResult = validateSchema(emailSchema, queryEmail);
    return validationResult.success;
  }, [queryEmail]);

  const userQuery = useQuery({
    queryKey: ['user-lookup', queryEmail],
    queryFn: () => lookupUserByEmail(queryEmail),
    enabled: Boolean(queryEmail) && isValidEmail,
    retry: false,
    staleTime: 0, // Always refetch, no caching
    gcTime: 0, // Don't keep in cache
  });

  useLayoutEffect(() => {
    if (isOpen) {
      setEmail('');
      setQueryEmail('');
    }
  }, [isOpen]);

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <Modal open={isOpen} onClose={handleClose} title="Add friend" goBackOnClose={false}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 w-full">
          <div className="relative w-full">
            <Input
              placeholder="Email"
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

            if (userQuery.isFetching || userQuery.isLoading) {
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

            if (userQuery.isError || !userQuery.data) {
              return (
                <p className="text-sm text-muted-foreground">
                  No user found.
                </p>
              );
            }

            return <AddFriendPanel user={userQuery.data} onSuccess={handleClose} />;
          })()}
        </div>
      </div>
    </Modal>
  );
}

export default AddFriendModal;
