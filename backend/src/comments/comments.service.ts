import { Injectable } from '@nestjs/common';
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

  async update(id: string, dto: UpdateCommentDto): Promise<Comment | null> {
    return this.commentModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async delete(id: string): Promise<Comment | null> {
    return this.commentModel.findByIdAndDelete(id).exec();
  }

  async likeComment(commentId: string, userId: string): Promise<Comment | null> {
    return this.commentModel.findByIdAndUpdate(
      commentId,
      { $addToSet: { likedBy: userId } },
      { new: true },
    ).exec();
  }

  async unlikeComment(commentId: string, userId: string): Promise<Comment | null> {
    return this.commentModel.findByIdAndUpdate(
      commentId,
      { $pull: { likedBy: userId } },
      { new: true },
    ).exec();
  }
}
