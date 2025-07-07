import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async create(dto: CreatePostDto): Promise<Post> {
    console.log(dto);
    const created = new this.postModel(dto);
    return created.save();
  }

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    const updated = await this.postModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Post not found');
    return updated;
  }

  async findById(id: string): Promise<Post> {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async findByUser(userId: string): Promise<Post[]> {
    return this.postModel.find({ authorId: userId });
  }

  async findFavoritedByUser(userId: string): Promise<Post[]> {
    return this.postModel.find({ favoritedBy: userId });
  }

  async addToFavorites(postId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const userObjectId = new Types.ObjectId(userId);
    if (!post.favoritedBy.some(id => id.equals(userObjectId))) {
      post.favoritedBy.push(userObjectId);
    }
    return post.save();
  }

  async removeFromFavorites(postId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const userObjectId = new Types.ObjectId(userId);
    post.favoritedBy = post.favoritedBy.filter(id => !id.equals(userObjectId));
    return post.save();
  }

  async incrementView(postId: string): Promise<Post> {
    const post = await this.postModel.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } },
      { new: true },
    );
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async upvote(postId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const userObjectId = new Types.ObjectId(userId);
    const alreadyUpvoted = post['votedUpUsers']?.some((id: Types.ObjectId) => id.equals(userObjectId));
    if (alreadyUpvoted) return post;

    post['votedDownUsers'] = (post['votedDownUsers'] || []).filter((id: Types.ObjectId) => !id.equals(userObjectId));
    post['votedUpUsers'] = [...(post['votedUpUsers'] || []), userObjectId];

    post.upvotes = post['votedUpUsers'].length;
    post.downvotes = post['votedDownUsers'].length;

    return post.save();
  }

  async downvote(postId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const userObjectId = new Types.ObjectId(userId);
    const alreadyDownvoted = post['votedDownUsers']?.some((id: Types.ObjectId) => id.equals(userObjectId));
    if (alreadyDownvoted) return post;

    post['votedUpUsers'] = (post['votedUpUsers'] || []).filter((id: Types.ObjectId) => !id.equals(userObjectId));
    post['votedDownUsers'] = [...(post['votedDownUsers'] || []), userObjectId];

    post.upvotes = post['votedUpUsers'].length;
    post.downvotes = post['votedDownUsers'].length;

    return post.save();
  }
  
  async unvote(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    post.votedUpUsers = post.votedUpUsers.filter(id => id.toString() !== userId);
    post.votedDownUsers = post.votedDownUsers.filter(id => id.toString() !== userId);

    post.upvotes = post['votedUpUsers'].length;
    post.downvotes = post['votedDownUsers'].length;

    await post.save();
    return post;
  }

}
