// Change Password DTO - Password change karne ke liye
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  // Current Password - purana password
  @IsString()
  @IsNotEmpty({ message: 'Current password zaroori hai' })
  currentPassword: string;

  // New Password - naya password
  @IsString()
  @IsNotEmpty({ message: 'New password zaroori hai' })
  @MinLength(6, { message: 'Password kam se kam 6 characters ka hona chahiye' })
  newPassword: string;

  // Confirm Password - naya password confirm karein
  @IsString()
  @IsNotEmpty({ message: 'Confirm password zaroori hai' })
  confirmPassword: string;
}
