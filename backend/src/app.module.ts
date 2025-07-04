import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import {MongooseModule} from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PostsModule,
    CommentsModule,
    MongooseModule.forRoot(process.env.MONGO_URI!),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
