// Forgot Password DTO - Password reset ke liye email validation
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  // Email field - OTP is email par bheja jayega
  @IsEmail({}, { message: 'Email valid hona chahiye' })
  @IsNotEmpty({ message: 'Email zaroori hai' })
  email: string;
}
