// Get Reports DTO - Lab reports lene ke liye with filters
import { IsOptional, IsString } from 'class-validator';

export class GetReportsDto {
  // Category filter - report category (e.g., "Blood Test", "X-Ray")
  @IsString()
  @IsOptional()
  category?: string;

  // Status filter - report status (pending, completed)
  @IsString()
  @IsOptional()
  status?: string;

  // Start date - kis date se reports dekhni hain
  @IsString()
  @IsOptional()
  startDate?: string;

  // End date - kis date tak reports dekhni hain
  @IsString()
  @IsOptional()
  endDate?: string;
}
