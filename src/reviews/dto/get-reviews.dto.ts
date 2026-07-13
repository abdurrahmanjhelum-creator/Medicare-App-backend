// Get Reviews DTO - Doctor ke reviews lene ke liye with pagination
import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class GetReviewsDto {
  // Doctor ID - URL path se milti hai, query mein optional rakhein validation avoid karne ke liye
  @IsOptional()
  @IsString()
  doctorId?: string;

  // Page number for pagination (optional)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  // Limit per page (optional)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
