import { Get, Controller, Param } from '@nestjs/common';
import { PostsService } from './posts.service'

@Controller('drafts')
export class DraftController {
    constructor(private readonly postsService : PostsService) {};

    @Get('user/:userId')
    findByUser(@Param('userId') userId: string) {
        return this.postsService.findDraftByUser(userId);
    }
}