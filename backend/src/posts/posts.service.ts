import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Notification } from 'src/notifications/schemas/notifications.schemas';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) 
    private postModel: Model<PostDocument>,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
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
    const post = await this.postModel
      .findById(id)
      .populate('authorId', 'username avatar');  
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async findPostByUser(userId: string): Promise<Post[]> {
    return this.postModel
    .find({ authorId: userId, isPublished: true })
    .sort({createdAt: -1})
    .exec();
  }

  async findDraftByUser(userId: string): Promise<Post[]> {
    return this.postModel
    .find({ authorId: userId, isPublished: false })
    .sort({ createdAt: -1 }) 
    .exec();
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
    const post = await this.postModel.findById(postId).select('authorId votedUpUsers votedDownUsers').exec();
    if (!post) throw new NotFoundException('Post not found');

    const userObjectId = new Types.ObjectId(userId);
    const alreadyUpvoted = post.votedUpUsers?.some((id: Types.ObjectId) => id.equals(userObjectId));
    if (alreadyUpvoted) return post;

    // Bỏ downvote cũ (nếu có) và thêm upvote mới
    post.votedDownUsers = (post.votedDownUsers || []).filter((id: Types.ObjectId) => !id.equals(userObjectId));
    post.votedUpUsers = [...(post.votedUpUsers || []), userObjectId];

    post.upvotes = post.votedUpUsers.length;
    post.downvotes = post.votedDownUsers.length;

    const postAuthor = post.authorId?.toString();
    if (postAuthor && postAuthor !== userId) {
      const type = 'like_post';
      const content = 'đã upvote bài viết của bạn.';

      const existingNotification = await this.notificationModel.findOne({
        receiverId: postAuthor,
        postId: post._id,
        type,
        isRead: false,
      });

      if (existingNotification) {
        if (!existingNotification.senderId.includes(userId)) {
          existingNotification.senderId.push(userId);
          existingNotification.content = content;
          await existingNotification.save();
        }
      } else {
        await this.notificationModel.create({
          senderId: [userId],
          receiverId: postAuthor,
          type,
          postId: post._id,
          content,
          isRead: false,
        });
      }
    }

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

  async findAllPaginated(page: number, type: 'blog' | 'qa') {
    const pageSize = 10;
    const isBlog = type === 'blog';

    const [posts, total] = await Promise.all([
      this.postModel
        .find({ isPublished: true, isBlog })
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.postModel.countDocuments({ isPublished: true, isBlog }),
    ]);

    return {
      posts,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    };
  }

  async deletePost(id: string): Promise<{ message: string }> {
    const deleted = await this.postModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Post not found');
    }
    return { message: 'Post deleted successfully' };
  }

  async searchPosts(query: string): Promise<any[]> {
    if (!query || query.trim() === '') return [];

    // Escape các ký tự đặc biệt trong regex
    const escapeRegex = (str: string) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Tách câu truy vấn thành các từ khóa riêng biệt
    const keywords = query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map(escapeRegex);

    // Tạo mảng regex với word boundary (\b)
    const regexList = keywords.map(
      word => new RegExp(`\\b${word}\\b`, 'i')
    );

    // Tạo điều kiện tìm kiếm $or
    const orConditions = regexList.flatMap(regex => [
      { title: { $regex: regex } },
      { content: { $regex: regex } },
    ]);

    // Lấy các bài post phù hợp
    const posts = await this.postModel.find({
      isPublished: true,
      $or: orConditions,
    });

    // Tính score và sắp xếp
    const scored = posts
      .map((post) => {
        const titleText = post.title.toLowerCase();
        const contentText = post.content.toLowerCase();

        let titleCount = 0;
        let contentCount = 0;

        for (const word of keywords) {
          const wordRegex = new RegExp(`\\b${word}\\b`, 'g');
          titleCount += (titleText.match(wordRegex) || []).length;
          contentCount += (contentText.match(wordRegex) || []).length;
        }

        const score = titleCount * 3 + contentCount; // Ưu tiên title (*3)
        return { post, score };
      })
      .sort((a, b) => b.score - a.score);

    return scored.map(item => item.post);
  }


  async getPostsPaginated(
    page: number,
    limit: number,
    isBlog?: boolean,
    sort?: string,
  ) {
    const skip = (page - 1) * limit;
    const filter: any = { isPublished: true };

    if (typeof isBlog === "boolean") {
      filter.isBlog = isBlog;
    }

    // Nếu là sort=unanswered thì thêm điều kiện
    if (sort === "unanswered") {
      filter.commentCount = 0;
    }

    // Nếu là sort theo voted, thì dùng pipeline
    if (sort === "voted") {
      const pipeline: PipelineStage[] = [
        { $match: filter },
        {
          $addFields: {
            voteScore: {
              $subtract: [
                { $ifNull: ["$upvotes", 0] },
                { $ifNull: ["$downvotes", 0] },
              ],
            },
          },
        },
        { $sort: { voteScore: -1 as -1 } },
        { $skip: skip },
        { $limit: limit },
      ];

      const posts = await this.postModel.aggregate(pipeline);
      const total = await this.postModel.countDocuments(filter);
      return { posts, total };
    }

    // Các sort còn lại (newest, popular...)
    let sortCondition: any = { createdAt: -1 }; // default

    if (sort === "popular") {
      sortCondition = { views: -1 };
    } else if (sort === "newest") {
      sortCondition = { createdAt: -1 };
    }

    const [posts, total] = await Promise.all([
      this.postModel.find(filter).sort(sortCondition).skip(skip).limit(limit),
      this.postModel.countDocuments(filter),
    ]);

    return { posts, total };
  }

  async findTopContributors(limit = 5) {
    const orphanPosts = await this.postModel.find({ authorId: null });
    console.log(orphanPosts);

    const results = await this.postModel.aggregate([
      {
        $match: {
          isPublished: true,
          authorId: { $ne: null }, // loại bài không có tác giả
        },
      },
      {
        $group: {
          _id: "$authorId", // gom theo authorId
          postCount: { $sum: 1 },
        },
      },
      { $sort: { postCount: -1, _id: -1 } }, // nếu = post thì xếp theo id 
      { $limit: limit },
      {
        $project: {
          authorId: "$_id",
          postCount: 1,
          _id: 0, // bỏ _id gốc
        },
      },
    ]);

    return results; // [{ authorId, postCount }]
  }

  async getMostPopularTags(limit = 10): Promise<string[]> {
    const results = await this.postModel.aggregate([
      { $match: { isPublished: true } },
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { _id: 0, tag: "$_id" } }
    ]);

    return results.map((r) => r.tag);
  }

  async findLatestPosts(limit = 5) {
    return this.postModel
      .find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("title _id");
  }

  async getTopTagsByUser(userId: string, limit = 3) {
    try {
      const results = await this.postModel.aggregate([
        {
          $match: {
            authorId: userId,
            isPublished: true,
            tags: { $exists: true, $ne: [] },
          },
        },
        { $unwind: "$tags" },
        {
          $group: {
            _id: "$tags",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: limit },
        {
          $project: {
            _id: 0,
            name: "$_id", // tên tag
            count: 1,     // số lần xuất hiện
          },
        },
      ]);

      return results;
    } catch (error) {
      console.error("Error in getTopTagsByUser:", error);
      return [];
    }
  }
}
