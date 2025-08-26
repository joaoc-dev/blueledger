import type { FriendshipDocument } from './model';
import type { FriendshipDisplay } from './schemas';

export function mapModelToDisplay(
  friendship: FriendshipDocument,
  currentUserId?: string,
): FriendshipDisplay {
  const obj = friendship.toObject();
  const userIsRequester = currentUserId ? obj.requester._id.toString() === currentUserId : undefined;
  const userIsRecipient = currentUserId ? obj.recipient._id.toString() === currentUserId : undefined;

  // Compute friend based on userIsRequester
  const friend = userIsRequester
    ? {
        name: obj.recipient?.name,
        email: obj.recipient?.email,
        image: obj.recipient?.image,
      }
    : {
        name: obj.requester?.name,
        email: obj.requester?.email,
        image: obj.requester?.image,
      };

  return {
    id: obj._id.toString(),
    requesterName: obj.requester?.name,
    requesterEmail: obj.requester?.email,
    requesterImage: obj.requester?.image,
    recipientName: obj.recipient?.name,
    recipientEmail: obj.recipient?.email,
    recipientImage: obj.recipient?.image,
    userIsRequester,
    userIsRecipient,
    friend,
    status: obj.status,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    acceptedAt: obj.acceptedAt,
  };
}
