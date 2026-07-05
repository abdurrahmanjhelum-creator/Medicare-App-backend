// Get Earnings DTO - Doctor ki earnings lene ke liye date range ke saath
import { IsOptional, IsString } from 'class-validator';

export class GetEarningsDto {
  // Start date - kis date se earnings dekhni hain (optional)
  @IsString()
  @IsOptional()
  startDate?: string;

  // End date - kis date tak earnings dekhni hain (optional)
  @IsString()
  @IsOptional()
  endDate?: string;
}
