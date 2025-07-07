import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop()
  content: string;

  @Prop({ default: false }) // true: đã đăng, false: draft
  isPublished: boolean;

  @Prop({default: true})
  isBlog: boolean; // true: blog, false: question

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  favoritedBy: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: 0 })
  upvotes: number;

  @Prop({ default: 0 })
  downvotes: number;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] }) // Array of user IDs who upvoted
  votedUpUsers: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  votedDownUsers: Types.ObjectId[];

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  commentCount: number;
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
