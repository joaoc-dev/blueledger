import mongoose, { Schema, Document, Model } from 'mongoose';

// This interface represents the properties of an User document
interface IUser {
  _id: string;
  name: string;
  email: string;
  emailVerified: Date;
  image: string;
  account: string;
  userId: string;
  type: string;
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
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email is invalid',
      ],
    },
    // password: {
    //   type: String,
    //   required: true,
    // },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    image: {
      type: String,
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
