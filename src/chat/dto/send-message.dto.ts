// Send Message DTO - Message bhejne ke liye
import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  // Receiver ID - jis ko message bhejna hai
  @IsString()
  @IsNotEmpty({ message: 'Receiver ID zaroori hai' })
  receiverId: string;

  // Message content
  @IsString()
  @IsNotEmpty({ message: 'Message content zaroori hai' })
  content: string;
}
