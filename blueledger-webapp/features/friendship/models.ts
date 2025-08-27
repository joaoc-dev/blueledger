import type { Document, Model, ObjectId } from 'mongoose';
import type { FriendshipStatus } from './constants';
import mongoose, { Schema } from 'mongoose';
import { FRIENDSHIP_STATUS } from './constants';

interface IFriendship {
  requester: ObjectId | string;
  recipient: ObjectId | string;
  status: FriendshipStatus;
  acceptedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FriendshipDocument extends IFriendship, Document {}

interface FriendshipModel extends Model<FriendshipDocument> {}

const FriendshipSchema = new Schema<FriendshipDocument>(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester is required'],
      index: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
      index: true,
    },
    status: {
      type: String,
      enum: FRIENDSHIP_STATUS,
      default: FRIENDSHIP_STATUS.NONE,
      index: true,
    },
    acceptedAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

FriendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });

const Friendship
  = (mongoose.models.Friendship as FriendshipModel)
    || mongoose.model<FriendshipDocument, FriendshipModel>('Friendship', FriendshipSchema);

export default Friendship;
