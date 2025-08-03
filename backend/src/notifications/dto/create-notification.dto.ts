import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  senderId: string;

  @IsString()
  receiverId: string;

  @IsIn(['like', 'comment'])
  type: 'like' | 'comment';

  @IsOptional()
  @IsString()
  postId?: string;

  @IsOptional()
  @IsString()
  commentId?: string;

  @IsString()
  content: string;
}
