import type { GroupDocument, GroupMembershipDocument } from './models';
import type { GroupDisplay, GroupMembershipDisplay } from './schemas';

export function mapGroupModelToDisplay(group: GroupDocument): GroupDisplay {
  const obj = group.toObject ? group.toObject() : group;
  const owner = obj.owner?.toObject ? obj.owner.toObject() : obj.owner;

  return {
    id: obj._id.toString(),
    name: obj.name,
    image: obj.image ?? '',
    ownerName: owner?.name || 'Unknown',
    status: obj.status,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

export function mapGroupMembershipToDisplay(
  membership: GroupMembershipDocument,
): GroupMembershipDisplay {
  const obj = membership.toObject ? membership.toObject() : membership;
  const group = obj.group.toObject ? obj.group.toObject() : obj.group;
  const owner = group?.owner?.toObject ? group.owner.toObject() : group.owner;
  const user = obj.user?.toObject ? obj.user.toObject() : obj.user;
  const invitedBy = obj.invitedBy?.toObject ? obj.invitedBy.toObject() : obj.invitedBy;

  const result: GroupMembershipDisplay = {
    id: obj._id.toString(),
    group: {
      id: group?._id.toString(),
      name: group?.name,
      image: group?.image,
      ownerName: owner?.name || 'Unknown',
      ownerImage: owner?.image,
      memberCount: group?.memberCount || 0,
      memberSince: obj.acceptedAt,
    },
    user: {
      name: user?.name,
      email: user?.email,
      image: user?.image,
    },
    invitedByName: invitedBy?.name,
    role: obj.role,
    status: obj.status,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    acceptedAt: obj.acceptedAt,
  };

  return result;
}
