// Create Review DTO - Doctor ke liye review create karne ke liye
import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewDto {
  // Appointment ID - Jis appointment ka review hai
  @IsString()
  @IsNotEmpty({ message: 'Appointment ID zaroori hai' })
  appointmentId: string;

  // Doctor ID - jis doctor ke liye review hai
  @IsString()
  @IsNotEmpty({ message: 'Doctor ID zaroori hai' })
  doctorId: string;

  // Rating - 1 se 5 stars tak
  @IsNumber()
  @IsNotEmpty({ message: 'Rating zaroori hai' })
  @Min(1, { message: 'Rating kam se kam 1 hona chahiye' })
  @Max(5, { message: 'Rating maximum 5 ho sakta hai' })
  rating: number;

  // Comment - review ka text
  @IsString()
  @IsNotEmpty({ message: 'Comment zaroori hai' })
  comment: string;
}
