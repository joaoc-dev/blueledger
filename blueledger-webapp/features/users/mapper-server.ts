import type { UserDocument } from './models';
import type { UserDisplay } from './schemas';

export function mapModelToDisplay(user: UserDocument): UserDisplay {
  const obj = user.toObject();
  return {
    id: obj._id.toString(),
    name: obj.name,
    image: obj.image,
    imagePublicId: obj.imagePublicId,
    email: obj.email,
    bio: obj.bio,
    emailVerified: obj.emailVerified,
    friendshipStatus: obj.friendshipStatus,
  };
}
