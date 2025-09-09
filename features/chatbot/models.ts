import type { Document, Model, ObjectId } from 'mongoose';
import type { ChatbotRole } from './constants';
import mongoose, { Schema } from 'mongoose';
import { CHATBOT_ROLES } from './constants';

interface IMessage {
  content: string;
  role: ChatbotRole;
  user: ObjectId | string;
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageDocument extends IMessage, Document {}

interface MessageModel extends Model<MessageDocument> {
  // Add any static methods here
}

const MessageSchema = new Schema<MessageDocument>(
  {
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: CHATBOT_ROLES,
      required: [true, 'Role is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    // Vector embedding of the message content for semantic search.
    // Ensure a Search index named "message_embedding_index" targets this path.
    embedding: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// This is the key part - we need to specify both the document type and model type
const Message
  = (mongoose.models.Message as MessageModel)
    || mongoose.model<MessageDocument, MessageModel>('Message', MessageSchema);

export default Message;
