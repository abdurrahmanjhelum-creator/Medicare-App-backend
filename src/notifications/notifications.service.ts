// Notifications Service - Notifications logic handle karne ke liye
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './entities/notification.entity';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { MarkReadDto } from './dto/mark-read.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  // Get Notifications method - User ke saare notifications lein
  async getNotifications(userId: string, getNotificationsDto: GetNotificationsDto) {
    const { isRead, page = 1, limit = 20 } = getNotificationsDto;

    // Query build karein
    const query: any = { userId };

    // Agar isRead filter hai, toh add karein
    if (isRead !== undefined) {
      query.isRead = isRead;
    }

    // Pagination calculate karein
    const skip = (page - 1) * limit;

    // Notifications lein database se
    const notifications = await this.notificationModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Total count calculate karein
    const total = await this.notificationModel.countDocuments(query);

    // Unread count calculate karein
    const unreadCount = await this.notificationModel.countDocuments({
      userId,
      isRead: false,
    });

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  // Mark As Read method - Notification ko read mark karein
  async markAsRead(userId: string, markReadDto: MarkReadDto) {
    const { notificationId } = markReadDto;

    // Notification lein database se
    const notification = await this.notificationModel.findById(notificationId);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    // Check karein ke notification user ka hai
    if (notification.userId !== userId) {
      throw new Error('Aap sirf apne notifications read mark kar sakte hain');
    }

    // Notification ko read mark karein
    notification.isRead = true;
    await notification.save();

    return {
      message: 'Notification marked as read',
      notification,
    };
  }

  // Mark All As Read method - Saare notifications ko read mark karein
  async markAllAsRead(userId: string) {
    // Saare unread notifications update karein
    await this.notificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true },
    );

    return {
      message: 'All notifications marked as read',
    };
  }

  // Delete Notification method - Notification delete karein
  async deleteNotification(userId: string, notificationId: string) {
    // Notification lein database se
    const notification = await this.notificationModel.findById(notificationId);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    // Check karein ke notification user ka hai
    if (notification.userId !== userId) {
      throw new Error('Aap sirf apne notifications delete kar sakte hain');
    }

    // Notification delete karein
    await this.notificationModel.findByIdAndDelete(notificationId);

    return {
      message: 'Notification deleted successfully',
    };
  }

  // Create Notification method - Naya notification create karein (internal use)
  async createNotification(userId: string, title: string, message: string, type: string, relatedId?: string) {
    // Notification create karein
    const notification = await this.notificationModel.create({
      userId,
      title,
      message,
      type,
      icon: this.getIconForType(type),
      iconColor: this.getIconColorForType(type),
      iconBackgroundColor: this.getIconBgColorForType(type),
      relatedId,
      isRead: false,
    });

    return notification;
  }

  // Get Icon For Type method - Type ke base par icon return karein
  private getIconForType(type: string): string {
    const icons: { [key: string]: string } = {
      appointment: 'calendar',
      chat: 'message',
      system: 'bell',
      medical: 'activity',
      payment: 'credit-card',
    };
    return icons[type] || 'bell';
  }

  // Get Icon Color For Type method - Type ke base par icon color return karein
  private getIconColorForType(type: string): string {
    const colors: { [key: string]: string } = {
      appointment: '#3B82F6',
      chat: '#10B981',
      system: '#F59E0B',
      medical: '#EF4444',
      payment: '#8B5CF6',
    };
    return colors[type] || '#6B7280';
  }

  // Get Icon Background Color For Type method - Type ke base par background color return karein
  private getIconBgColorForType(type: string): string {
    const bgColors: { [key: string]: string } = {
      appointment: '#DBEAFE',
      chat: '#D1FAE5',
      system: '#FEF3C7',
      medical: '#FEE2E2',
      payment: '#EDE9FE',
    };
    return bgColors[type] || '#F3F4F6';
  }
}
