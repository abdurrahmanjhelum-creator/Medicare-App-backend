// Get Reviews DTO - Doctor ke reviews lene ke liye with pagination
import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';

export class GetReviewsDto {
  // Doctor ID - jis doctor ke reviews chahiye
  @IsString()
  @IsNotEmpty({ message: 'Doctor ID zaroori hai' })
  doctorId: string;

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
