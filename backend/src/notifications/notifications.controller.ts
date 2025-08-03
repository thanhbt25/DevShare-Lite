import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get(':userId') 
  async getNotifications(@Param('userId') userId: string) {
    return this.notificationsService.findByReceiver(userId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req) {
    await this.notificationsService.markAllAsRead(req.user.id);
    return { success: true };
  }
}

