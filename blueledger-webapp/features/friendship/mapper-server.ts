import type { FriendshipDocument } from './model';
import type { FriendshipDisplay } from './schemas';

export function mapModelToDisplay(friendship: FriendshipDocument): FriendshipDisplay {
  const obj = friendship.toObject();

  return {
    id: obj._id.toString(),
    requesterName: obj.requester?.name,
    requesterEmail: obj.requester?.email,
    requesterImage: obj.requester?.image,
    recipientName: obj.recipient?.name,
    recipientEmail: obj.recipient?.email,
    recipientImage: obj.recipient?.image,
    status: obj.status,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    acceptedAt: obj.acceptedAt,
  };
}
