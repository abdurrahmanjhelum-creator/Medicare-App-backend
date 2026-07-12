// Notifications Controller - Notifications endpoints handle karne ke liye
import { Controller, Get, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { MarkReadDto } from './dto/mark-read.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  // Get Notifications endpoint - User ke saare notifications lein (protected)
  @Get()
  async getNotifications(@Request() req, @Query() getNotificationsDto: GetNotificationsDto) {
    return this.notificationsService.getNotifications(req.user.userId, getNotificationsDto);
  }

  // Mark As Read endpoint - Notification ko read mark karein (protected)
  @Put('mark-read')
  async markAsRead(@Request() req, @Body() markReadDto: MarkReadDto) {
    return this.notificationsService.markAsRead(req.user.userId, markReadDto);
  }

  // Mark All As Read endpoint - Saare notifications ko read mark karein (protected)
  @Put('mark-all-read')
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  // Delete Notification endpoint - Notification delete karein (protected)
  @Delete(':id')
  async deleteNotification(@Request() req, @Param('id') notificationId: string) {
    return this.notificationsService.deleteNotification(req.user.userId, notificationId);
  }
}
