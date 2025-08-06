import mongoose, { Document, Model, ObjectId, Schema } from 'mongoose';
import { NOTIFICATION_TYPE_VALUES, NotificationType } from './constants';

interface INotification {
  user: ObjectId | string;
  fromUser: ObjectId | string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationDocument extends INotification, Document {}

interface NotificationModel extends Model<NotificationDocument> {
  // Add any static methods here
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'From User ID is required'],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: NOTIFICATION_TYPE_VALUES,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification =
  (mongoose.models.Notification as NotificationModel) ||
  mongoose.model<NotificationDocument, NotificationModel>(
    'Notification',
    NotificationSchema
  );

export default Notification;
