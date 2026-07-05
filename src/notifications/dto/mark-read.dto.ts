// Mark Read DTO - Notification ko read mark karne ke liye
import { IsNotEmpty, IsString } from 'class-validator';

export class MarkReadDto {
  // Notification ID - jo notification read mark karna hai
  @IsString()
  @IsNotEmpty({ message: 'Notification ID zaroori hai' })
  notificationId: string;
}
