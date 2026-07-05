// Chat Controller - Chat endpoints handle karne ke liye
import { Controller, Get, Post, Delete, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SendMessageDto } from './dto/send-message.dto';
import { GetMessagesDto } from './dto/get-messages.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  // Send Message endpoint - Naya message bhejega
  @Post('send')
  async sendMessage(@Request() req, @Body() sendMessageDto: SendMessageDto) {
    return this.chatService.sendMessage(req.user.userId, sendMessageDto);
  }

  // Get Messages endpoint - Do users ke beech ke messages lein
  @Get('messages')
  async getMessages(@Request() req, @Query() getMessagesDto: GetMessagesDto) {
    return this.chatService.getMessages(req.user.userId, getMessagesDto);
  }

  // Get Conversations endpoint - User ki saari conversations lein
  @Get('conversations')
  async getConversations(@Request() req) {
    return this.chatService.getConversations(req.user.userId);
  }

  // Mark as Read endpoint - Messages ko read mark karega
  @Put('messages/:userId/read')
  async markAsRead(@Request() req, @Param('userId') otherUserId: string) {
    return this.chatService.markAsRead(req.user.userId, otherUserId);
  }

  // Delete Message endpoint - Message delete karega
  @Delete('messages/:id')
  async deleteMessage(@Request() req, @Param('id') messageId: string) {
    return this.chatService.deleteMessage(req.user.userId, messageId);
  }
}
