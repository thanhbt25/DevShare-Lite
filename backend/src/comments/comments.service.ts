import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Post,  PostDocument } from 'src/posts/schemas/post.schema';
import { Notification } from 'src/notifications/schemas/notifications.schemas';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) 
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  async create(dto: CreateCommentDto): Promise<Comment> {
    const comment = new this.commentModel(dto);
    const savedComment = await comment.save();
    const post = await this.postModel.findById(dto.postId).select('authorId').exec();
    const postAuthor = post?.authorId?.toString();

    const existingNotification = await this.notificationModel.findOne({
      receiverId: postAuthor,
      type: 'comment',
      postId: dto.postId,
      isRead: false, // chi gop neu thong bao cu chua duoc doc
    });

    if (existingNotification) {
      if (!existingNotification.senderId.includes(dto.authorId)) {
        existingNotification.senderId.push(dto.authorId);
        existingNotification.content = 'New comment on your post';
        await existingNotification.save();
      }
    } else {
      // Nếu chưa có thì tạo mới 
      const newNotificaton = await this.notificationModel.create( {
        senderId: [dto.authorId],
        receiverId: postAuthor,
        type: 'comment',
        postId: dto.postId,
        content: 'New comment on you post: ' + savedComment.content,
        isRead: false,
      })
    }

    return savedComment;
  }

  async findAll(): Promise<Comment[]> {
    return this.commentModel.find().exec();
  }

  async update(id: string, dto: UpdateCommentDto): Promise<Comment | null> {
    return this.commentModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async delete(id: string): Promise<Comment | null> {
    return this.commentModel.findByIdAndDelete(id).exec();
  }

  async voteComment(commentId: string, userId: string, isUpvote: boolean): Promise<{ message: string }> {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    const userObjectId = new Types.ObjectId(userId);
    const index = comment.likedBy.findIndex(id => id.toString() === userObjectId.toString());

    if (isUpvote) {
      if (index === -1) comment.likedBy.push(userObjectId);
    } else {
      if (index !== -1) comment.likedBy.splice(index, 1);
    }

    await comment.save();
    return { message: isUpvote ? 'Upvoted' : 'Unvoted' };
  }

  
  async findByPostId(postId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ postId })
      .sort({ createdAt: -1 }) 
      .exec();
  }
}
