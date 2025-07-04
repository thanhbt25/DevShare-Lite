import { Controller, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.commentsService.delete(id);
  }

  @Post(':id/like/:userId')
  likeComment(@Param('id') commentId: string, @Param('userId') userId: string) {
    return this.commentsService.likeComment(commentId, userId);
  }

  @Post(':id/unlike/:userId')
  unlikeComment(@Param('id') commentId: string, @Param('userId') userId: string) {
    return this.commentsService.unlikeComment(commentId, userId);
  }
}
