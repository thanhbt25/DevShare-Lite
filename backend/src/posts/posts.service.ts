import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = new this.postModel(createPostDto);
    return post.save();
  }

  async update(postId: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel.findByIdAndUpdate(postId, updatePostDto, { new: true }).exec();
    if (!updatedPost) {
      throw new Error('Post not found');
    }
    return updatedPost;
  }

  async findByUser(userId: string): Promise<Post[]> {
    return this.postModel.find({ authorId: userId }).exec();
  }

  async findFavoritedByUser(userId: string): Promise<Post[]> {
    return this.postModel.find({ favoritedBy: new Types.ObjectId(userId) }).exec();
  }

  async addToFavorites(postId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findByIdAndUpdate(
      postId,
      { $addToSet: { favoritedBy: userId } },
      { new: true },
    ).exec();

    if (!post) {
      throw new Error('Post not found');
    } 
    return post;
  }

  async removeFromFavorites(postId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findByIdAndUpdate(
      postId,
      { $pull: { favoritedBy: userId } },
      { new: true },
    ).exec();

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  }
}
