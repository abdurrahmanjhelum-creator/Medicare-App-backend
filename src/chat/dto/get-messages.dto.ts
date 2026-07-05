// Get Messages DTO - Messages lene ke liye with pagination
import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';

export class GetMessagesDto {
  // User ID - jis user ke saath conversation hai
  @IsString()
  @IsNotEmpty({ message: 'User ID zaroori hai' })
  userId: string;

  // Page number for pagination (optional)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  // Limit per page (optional)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 50;
}
