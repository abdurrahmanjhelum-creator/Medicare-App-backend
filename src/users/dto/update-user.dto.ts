// Update User DTO - User profile update karne ke liye
import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  // Name - user ka naam (optional)
  @IsString()
  @IsOptional()
  name?: string;

  // Phone - user ka phone number (optional)
  @IsString()
  @IsOptional()
  phone?: string;

  // Address - user ka address (optional)
  @IsString()
  @IsOptional()
  address?: string;

  // Profile Image - profile image URL (optional)
  @IsString()
  @IsOptional()
  profileImage?: string;
}
