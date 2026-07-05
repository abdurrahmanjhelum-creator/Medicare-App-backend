// Message Entity - Chat messages ke liye MongoDB schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message extends Document {
  // Message ID - MongoDB automatically generates this
  _id: string;

  // Sender ID - jis ne message bheja
  @Prop({ required: true })
  senderId: string;

  // Sender ka naam (denormalized for quick access)
  @Prop({ required: true })
  senderName: string;

  // Receiver ID - jis ko message bheja gaya
  @Prop({ required: true })
  receiverId: string;

  // Receiver ka naam (denormalized for quick access)
  @Prop({ required: true })
  receiverName: string;

  // Message content
  @Prop({ required: true })
  content: string;

  // Kya message padha gaya hai
  @Prop({ default: false })
  isRead: boolean;

  // Created at timestamp (auto-generated)
  createdAt: Date;

  // Updated at timestamp (auto-generated)
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
