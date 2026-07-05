// Delete Review DTO - Review delete karne ke liye
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteReviewDto {
  // Review ID - jo review delete karna hai
  @IsString()
  @IsNotEmpty({ message: 'Review ID zaroori hai' })
  reviewId: string;
}
