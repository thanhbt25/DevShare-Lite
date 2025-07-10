import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Post" }], default: [] })
  favorites: Types.ObjectId[];

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'https://ui-avatars.com/api/?name=User&background=random' })
  avatar: string;

  @Prop({ default: Date.now }) 
  created_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Chuyển _id thành id khi trả dữ liệu về
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});