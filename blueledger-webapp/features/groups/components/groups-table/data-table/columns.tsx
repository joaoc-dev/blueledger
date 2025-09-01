import type { ColumnDef } from '@tanstack/react-table';
import type { GroupMembershipDisplay } from '@/features/groups/schemas';
import { columnHeader } from '@/components/shared/data-table/sortable-column';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GroupActions } from '../actions/group-actions';
import { PendingGroupActions } from '../actions/pending-group-actions';

const fillerColumn: ColumnDef<GroupMembershipDisplay> = {
  id: 'filler',
  header: () => null,
  cell: () => null,
  minSize: 0,
  enableHiding: false,
  enableResizing: false,
  enablePinning: true,
  meta: { isFiller: true },
};

export const activeGroupsColumns: ColumnDef<GroupMembershipDisplay>[] = [
  {
    id: 'name',
    header: 'Group',
    accessorFn: groupMembership => groupMembership.group.name,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const { group } = row.original;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage
              src={group.image || undefined}
              alt={group.name || 'Group'}
              className="object-cover scale-150"
            />
            <AvatarFallback>{group.name?.[0]?.toUpperCase() ?? 'G'}</AvatarFallback>
          </Avatar>
          <span>{group.name || 'Unknown group'}</span>
        </div>
      );
    },
  },
  {
    id: 'owner',
    accessorFn: groupMembership => groupMembership.group.ownerName,
    header: columnHeader('Owner'),
    size: 250,
    cell: ({ row }) => {
      const groupMembership = row.original;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage
              src={(groupMembership.group as any).ownerImage || undefined}
              alt={groupMembership.group.ownerName || 'User'}
            />
            <AvatarFallback>
              {groupMembership.group.ownerName?.[0]?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <span>{groupMembership.group.ownerName || 'Unknown user'}</span>
        </div>
      );
    },
  },
  {
    id: 'members',
    accessorKey: 'members',
    header: columnHeader('Members'),
    size: 300,
    accessorFn: groupMembership => groupMembership.group.memberCount,
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">
        {getValue<string>()}
      </span>
    ),
  },
  {
    id: 'memberSince',
    accessorFn: groupMembership => groupMembership.group.memberSince,
    header: columnHeader('Member since'),
    size: 150,
    cell: ({ row }) => {
      const groupMembership = row.original;

      return (
        <span className="text-sm text-muted-foreground">
          {groupMembership.group.memberSince
            ? new Date(groupMembership.group.memberSince).toLocaleDateString()
            : ''}
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
      const groupMembership = row.original;

      return (
        <div className="flex justify-center">
          <GroupActions groupMembership={groupMembership} disabled={false} />
        </div>
      );
    },
    enableHiding: false,
    enableResizing: false,
    enablePinning: true,
    enableSorting: false,
  },
];

export const pendingInvitesColumns: ColumnDef<GroupMembershipDisplay>[] = [
  {
    id: 'name',
    header: 'Group',
    accessorFn: groupMembership => groupMembership.group.name,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const { group } = row.original;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage
              src={group.image || undefined}
              alt={group.name || 'Group'}
              className="object-cover scale-150"
            />
            <AvatarFallback>{group.name?.[0]?.toUpperCase() ?? 'G'}</AvatarFallback>
          </Avatar>
          <span>{group.name || 'Unknown group'}</span>
        </div>
      );
    },
  },
  {
    id: 'owner',
    accessorFn: groupMembership => groupMembership.group.ownerName,
    header: columnHeader('Owner'),
    size: 250,
    cell: ({ row }) => {
      const groupMembership = row.original;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage
              src={(groupMembership.group as any).ownerImage || undefined}
              alt={groupMembership.group.ownerName || 'User'}
            />
            <AvatarFallback>{groupMembership.group.ownerName?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
          </Avatar>
          <span>{groupMembership.group.ownerName || 'Unknown user'}</span>
        </div>
      );
    },
  },
  {
    id: 'invitedBy',
    accessorFn: groupMembership => groupMembership.invitedByName,
    header: columnHeader('Invited by'),
    size: 200,
    cell: ({ row }) => {
      const groupMembership = row.original;

      return (
        <span className="text-sm text-muted-foreground">
          {groupMembership.invitedByName || 'Unknown'}
        </span>
      );
    },
  },
  {
    id: 'updatedAt',
    accessorKey: 'updatedAt',
    header: columnHeader('Invited on'),
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
      const groupMembership = row.original;

      return (
        <div className="flex justify-center gap-1">
          <PendingGroupActions groupMembership={groupMembership} />
        </div>
      );
    },
    enableHiding: false,
    enableResizing: false,
    enablePinning: true,
    enableSorting: false,
  },
];
