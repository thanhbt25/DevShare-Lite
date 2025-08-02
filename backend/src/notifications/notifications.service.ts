import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notifications.schemas';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>, 
    private readonly gateway: NotificationsGateway,
  ) {}

  async create(data: Partial<Notification>): Promise<Notification> {
    const created = new this.notificationModel(data);
    const saved = await created.save();

    if (saved.receiverId) {
      this.gateway.sendNotificationToUser(saved.receiverId, saved);
    }

    return saved;
  }

  async findByReceiver(receiverId: string): Promise<Notification[]> {
    return this.notificationModel.find({ receiverId }).sort({ createdAt: -1 }).exec();
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    const notification = await this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification;
  }

  async markAllAsRead(receiverId: string): Promise<void> {
    await this.notificationModel.updateMany({ receiverId, isRead: false }, { isRead: true });
  }
}
