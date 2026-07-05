// Get Payments DTO - Payments lene ke liye with filters
import { IsOptional, IsString } from 'class-validator';

export class GetPaymentsDto {
  // Status filter - payment status (pending, completed, failed, refunded)
  @IsString()
  @IsOptional()
  status?: string;

  // Start date - kis date se payments dekhni hain
  @IsString()
  @IsOptional()
  startDate?: string;

  // End date - kis date tak payments dekhni hain
  @IsString()
  @IsOptional()
  endDate?: string;
}
