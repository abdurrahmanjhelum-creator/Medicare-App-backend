// Chat Service - Chat logic handle karne ke liye
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './entities/message.entity';
import { User, UserDocument } from '../auth/entities/user.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { GetMessagesDto } from './dto/get-messages.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Send Message method - Naya message bhejega
  async sendMessage(senderId: string, sendMessageDto: SendMessageDto) {
    const { receiverId, content } = sendMessageDto;

    // Receiver lein database se
    const receiver = await this.userModel.findById(receiverId);
    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    // Sender lein database se
    const sender = await this.userModel.findById(senderId);
    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    // Check karein ke sender aur receiver alag hain
    if (senderId === receiverId) {
      throw new BadRequestException('Cannot send message to yourself');
    }

    // Message create karein
    const message = await this.messageModel.create({
      senderId,
      senderName: sender.name,
      receiverId,
      receiverName: receiver.name,
      content,
      isRead: false,
    });

    return {
      message: 'Message sent successfully',
      data: message,
    };
  }

  // Get Messages method - Do users ke beech ke saare messages lein
  async getMessages(userId: string, getMessagesDto: GetMessagesDto) {
    const { userId: otherUserId, page = 1, limit = 50 } = getMessagesDto;

    // Other user lein database se
    const otherUser = await this.userModel.findById(otherUserId);
    if (!otherUser) {
      throw new NotFoundException('User not found');
    }

    // Pagination calculate karein
    const skip = (page - 1) * limit;

    // Messages lein database se - dono users ke beech ke messages
    const messages = await this.messageModel
      .find({
        $or: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Total count calculate karein
    const total = await this.messageModel.countDocuments({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    });

    // Unread messages count calculate karein
    const unreadCount = await this.messageModel.countDocuments({
      senderId: otherUserId,
      receiverId: userId,
      isRead: false,
    });

    return {
      messages: messages.reverse(), // Oldest messages pehle
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  // Get Conversations method - User ki saari conversations lein
  async getConversations(userId: string) {
    // Saare messages lein jisme user involved hai
    const messages = await this.messageModel
      .find({
        $or: [{ senderId: userId }, { receiverId: userId }],
      })
      .sort({ createdAt: -1 })
      .exec();

    // Unique conversations nikalein (last message per conversation)
    const conversationsMap = new Map();

    for (const message of messages) {
      const otherUserId =
        message.senderId === userId ? message.receiverId : message.senderId;
      const otherUserName =
        message.senderId === userId ? message.receiverName : message.senderName;

      // Agar conversation already map mein hai, toh skip karein
      if (conversationsMap.has(otherUserId)) {
        continue;
      }

      // Unread messages count calculate karein
      const unreadCount = await this.messageModel.countDocuments({
        senderId: otherUserId,
        receiverId: userId,
        isRead: false,
      });

      // Conversation add karein
      conversationsMap.set(otherUserId, {
        userId: otherUserId,
        userName: otherUserName,
        lastMessage: message.content,
        lastMessageTime: message.createdAt,
        unreadCount,
      });
    }

    // Map ko array mein convert karein
    const conversations = Array.from(conversationsMap.values());

    return {
      conversations,
      total: conversations.length,
    };
  }

  // Mark as Read method - Messages ko read mark karega
  async markAsRead(userId: string, otherUserId: string) {
    // Saare unread messages update karein
    await this.messageModel.updateMany(
      {
        senderId: otherUserId,
        receiverId: userId,
        isRead: false,
      },
      { isRead: true },
    );

    return {
      message: 'Messages marked as read',
    };
  }

  // Delete Message method - Message delete karega
  async deleteMessage(userId: string, messageId: string) {
    // Message lein database se
    const message = await this.messageModel.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check karein ke message sender ka hai
    if (message.senderId !== userId) {
      throw new BadRequestException('You can only delete your own messages');
    }

    // Message delete karein
    await this.messageModel.findByIdAndDelete(messageId);

    return {
      message: 'Message deleted successfully',
    };
  }
}
