import mongoose, { Schema, Document, Model } from 'mongoose';

// This interface represents the properties of an User document
interface IUser {
  name: string;
  email: string;
  image: string;
  imagePublicId: string;
  bio: string;
  emailVerified: Date;
  createdAt: Date;
  updatedAt: Date;
}

// This interface represents a User document with Mongoose methods
export interface UserDocument extends IUser, Document {}

// This interface represents the User model with static methods
interface UserModel extends Model<UserDocument> {
  // Add any static methods here
}

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email is invalid',
      ],
    },
    image: {
      type: String,
      required: false,
    },
    imagePublicId: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    emailVerified: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// This is the key part - we need to specify both the document type and model type
const User =
  (mongoose.models.User as UserModel) ||
  mongoose.model<UserDocument, UserModel>('User', UserSchema);

export default User;
