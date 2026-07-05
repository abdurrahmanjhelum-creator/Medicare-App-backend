// Get Notifications DTO - Notifications lene ke liye with filters
import { IsOptional, IsBoolean, IsInt, Min } from 'class-validator';

export class GetNotificationsDto {
  // Is Read filter - sirf unread notifications chahiye (optional)
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  // Page number for pagination (optional)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  // Limit per page (optional)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 20;
}
