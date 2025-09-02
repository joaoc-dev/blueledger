import type { ColumnDef } from '@tanstack/react-table';
import type { FriendshipDisplay } from '@/features/friendship/schemas';
import { columnHeader } from '@/components/shared/data-table/sortable-column';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FriendshipActions } from '../friendship-actions';

const fillerColumn: ColumnDef<FriendshipDisplay> = {
  id: 'filler',
  header: () => null,
  cell: () => null,
  minSize: 0,
  enableHiding: false,
  enableResizing: false,
  enablePinning: true,
  meta: { isFiller: true },
};

export const activeFriendshipsColumns: ColumnDef<FriendshipDisplay>[] = [
  {
    id: 'query',
    header: 'Query',
    accessorFn: (friendship) => {
      const friend = friendship.friend;

      if (friend) {
        return `${friend.name ?? ''} ${friend.email ?? ''}`.toLowerCase();
      }

      return '';
    },
    filterFn: (row, _id, filterValue) => {
      const value = (row.getValue<string>('query') || '').toLowerCase();
      return value.includes(String(filterValue).toLowerCase());
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'user',
    accessorKey: 'user',
    header: columnHeader('User'),
    size: 250,
    cell: ({ row }) => {
      const { friend } = row.original;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage src={friend?.image || undefined} alt={friend?.name || 'User'} />
            <AvatarFallback>{friend?.name?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
          </Avatar>
          <span>{friend?.name || 'Unknown user'}</span>
        </div>
      );
    },
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: columnHeader('Email'),
    size: 300,
    accessorFn: friendship => friendship.friend?.email || '',
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">
        {getValue<string>()}
      </span>
    ),
  },
  {
    id: 'acceptedAt',
    accessorKey: 'acceptedAt',
    header: columnHeader('Friends since'),
    size: 150,
    cell: ({ row }) => {
      const { acceptedAt } = row.original;
      return (
        <span className="text-sm text-muted-foreground">
          {acceptedAt ? new Date(acceptedAt).toLocaleDateString() : ''}
        </span>
      );
    },
  },
  fillerColumn,
  {
    id: 'actions',
    size: 80,
    maxSize: 80,
    cell: ({ row }) => {
      const friendship = row.original;

      return (
        <div className="flex justify-center">
          <FriendshipActions friendship={friendship} isCompact={true} />
        </div>
      );
    },
    enableHiding: false,
    enableResizing: false,
    enablePinning: true,
    enableSorting: false,
  },
];

export const pendingFriendshipsColumns: ColumnDef<FriendshipDisplay>[] = [
  {
    id: 'query',
    header: 'Query',
    accessorFn: (friendship) => {
      const friend = friendship.friend;

      if (friend) {
        return `${friend.name ?? ''} ${friend.email ?? ''}`.toLowerCase();
      }

      return '';
    },
    filterFn: (row, _id, filterValue) => {
      const value = (row.getValue<string>('query') || '').toLowerCase();
      return value.includes(String(filterValue).toLowerCase());
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'user',
    accessorKey: 'user',
    header: columnHeader('User'),
    size: 250,
    cell: ({ row }) => {
      const { friend } = row.original;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage src={friend?.image || undefined} alt={friend?.name || 'User'} />
            <AvatarFallback>{friend?.name?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
          </Avatar>
          <span>{friend?.name || 'Unknown user'}</span>
        </div>
      );
    },
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: columnHeader('Email'),
    size: 300,
    accessorFn: friendship => friendship.friend?.email || '',
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">
        {getValue<string>()}
      </span>
    ),
  },
  {
    id: 'updatedAt',
    accessorKey: 'updatedAt',
    header: columnHeader('Sent at'),
    size: 150,
    cell: ({ row }) => {
      const { updatedAt } = row.original;
      return (
        <span className="text-sm text-muted-foreground">
          {updatedAt ? new Date(updatedAt).toLocaleDateString() : ''}
        </span>
      );
    },
  },
  fillerColumn,
  {
    id: 'actions',
    size: 110,
    maxSize: 110,
    cell: ({ row }) => {
      const friendship = row.original;

      return (
        <div className="flex justify-center gap-1">
          <FriendshipActions friendship={friendship} isCompact={true} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    enablePinning: true,
  },
];
