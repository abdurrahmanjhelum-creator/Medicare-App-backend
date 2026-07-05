// Reset Password DTO - Naya password set karne ke liye
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  // Email field
  @IsString()
  @IsNotEmpty({ message: 'Email zaroori hai' })
  email: string;

  // OTP field - verification ke liye
  @IsString()
  @IsNotEmpty({ message: 'OTP zaroori hai' })
  otp: string;

  // New password field
  @IsString()
  @IsNotEmpty({ message: 'Naya password zaroori hai' })
  @MinLength(6, { message: 'Password kam se kam 6 characters ka hona chahiye' })
  newPassword: string;
}
