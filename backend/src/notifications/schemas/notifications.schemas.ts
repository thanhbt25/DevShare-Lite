import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: [String], default: []})
  senderId: string[];

  @Prop({ required: true })
  receiverId: string;

  @Prop({ required: true })
  type: 'like' | 'comment';

  @Prop()
  postId?: string;

  @Prop()
  commentId?: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);  // NotificationSchema là một đối tượng Mongoose Schema được tạo từ lớp Notification.
