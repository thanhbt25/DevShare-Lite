import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post, PostSchema } from './schemas/post.schema';
import { DraftController } from './drafts.controller';
import { Notification, NotificationSchema } from 'src/notifications/schemas/notifications.schemas';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Post.name, schema: PostSchema },
    { name: Notification.name, schema: NotificationSchema }
  ])],
  controllers: [PostsController, DraftController],
  providers: [PostsService],
})
export class PostsModule {}
