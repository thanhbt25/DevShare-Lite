import { Controller, Post, Patch, Get, Param, Body, Query, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() dto: CreatePostDto) {
    return this.postsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, dto);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.postsService.findPostByUser(userId);
  }

  @Get('favorites/:userId')
  findFavoritedByUser(@Param('userId') userId: string) {
    return this.postsService.findFavoritedByUser(userId);
  }

  @Get()
  findAll(@Query('page') page = '1', @Query('type') type: 'blog' | 'qa' = 'blog') {
    return this.postsService.findAllPaginated(+page, type);
  }


  @Get(':id')
  findById(@Param('id') id: string) {
    return this.postsService.findById(id);
  }

  @Post(':id/favorite/:userId')
  addToFavorites(@Param('id') postId: string, @Param('userId') userId: string) {
    return this.postsService.addToFavorites(postId, userId);
  }

  @Post(':id/unfavorite/:userId')
  removeFromFavorites(@Param('id') postId: string, @Param('userId') userId: string) {
    return this.postsService.removeFromFavorites(postId, userId);
  }

  @Post(':id/view')
  addView(@Param('id') postId: string) {
    return this.postsService.incrementView(postId);
  }

  @Post(':id/upvote/:userId')
  upvote(@Param('id') postId: string, @Param('userId') userId: string) {
    return this.postsService.upvote(postId, userId);
  }

  @Post(':id/downvote/:userId')
  downvote(@Param('id') postId: string, @Param('userId') userId: string) {
    return this.postsService.downvote(postId, userId);
  }

  @Patch(':id/unvote/:userId')
  unvote(@Param('id') postId: string, @Param('userId') userId: string) {
    return this.postsService.unvote(postId, userId);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
