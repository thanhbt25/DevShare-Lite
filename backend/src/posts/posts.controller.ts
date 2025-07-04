import { Controller, Post, Patch, Get, Param, Body } from '@nestjs/common';
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
    return this.postsService.findByUser(userId);
  }

  @Get('favorites/:userId')
  findFavoritedByUser(@Param('userId') userId: string) {
    return this.postsService.findFavoritedByUser(userId);
  }

  @Post(':id/favorite/:userId')
  addToFavorites(@Param('id') postId: string, @Param('userId') userId: string) {
    return this.postsService.addToFavorites(postId, userId);
  }

  @Post(':id/unfavorite/:userId')
  removeFromFavorites(@Param('id') postId: string, @Param('userId') userId: string) {
    return this.postsService.removeFromFavorites(postId, userId);
  }
}
