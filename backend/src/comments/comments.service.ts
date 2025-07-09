import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(dto: CreateCommentDto): Promise<Comment> {
    const comment = new this.commentModel(dto);
    return comment.save();
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
