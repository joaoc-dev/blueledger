import type { Document, Model, ObjectId } from 'mongoose';
import type { GroupMembershipStatus, GroupRole } from './constants';
import mongoose, { Schema } from 'mongoose';
import { GROUP_MEMBERSHIP_STATUS, GROUP_ROLES } from './constants';

interface IGroup {
  name: string;
  image?: string;
  owner: ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupDocument extends IGroup, Document {}

interface GroupModel extends Model<GroupDocument> {}

const GroupSchema = new Schema<GroupDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      maxLength: [50, 'Name must be less than 50 characters'],
      trim: true,
    },
    image: {
      type: String,
      required: false,
      default: '',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
      index: true,
    },
  },
  { timestamps: true },
);

const Group
  = (mongoose.models.Group as GroupModel)
    || mongoose.model<GroupDocument, GroupModel>('Group', GroupSchema);

interface IGroupMembership {
  group: ObjectId | string;
  user: ObjectId | string;
  invitedBy: ObjectId | string;
  role: GroupRole;
  status: GroupMembershipStatus;
  acceptedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupMembershipDocument extends IGroupMembership, Document {}

interface GroupMembershipModel extends Model<GroupMembershipDocument> {}

const GroupMembershipSchema = new Schema<GroupMembershipDocument>(
  {
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: [true, 'Group is required'],
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'invitedBy is required'],
    },
    role: {
      type: String,
      enum: GROUP_ROLES,
      default: GROUP_ROLES.MEMBER,
      index: true,
    },
    status: {
      type: String,
      enum: GROUP_MEMBERSHIP_STATUS,
      default: GROUP_MEMBERSHIP_STATUS.PENDING,
      index: true,
    },
    acceptedAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

GroupMembershipSchema.index({ group: 1, user: 1 }, { unique: true });

const GroupMembership
  = (mongoose.models.GroupMembership as GroupMembershipModel)
    || mongoose.model<GroupMembershipDocument, GroupMembershipModel>('GroupMembership', GroupMembershipSchema);

export default Group;
export { GroupMembership };
