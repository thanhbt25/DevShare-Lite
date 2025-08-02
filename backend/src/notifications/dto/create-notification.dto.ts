import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateNotificationDto {
    @IsString()
    senderId: string;

    @IsString()
    receiverId: string;

    
}