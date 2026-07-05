// Update Profile DTO - Patient profile update karne ke liye
import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateProfileDto {
  // Patient ka naam (optional)
  @IsString()
  @IsOptional()
  name?: string;

  // Phone number (optional)
  @IsString()
  @IsOptional()
  phone?: string;

  // Profile image URL (optional)
  @IsString()
  @IsOptional()
  profileImage?: string;

  // Blood group (optional)
  @IsString()
  @IsOptional()
  bloodGroup?: string;

  // Medical history - array of previous conditions (optional)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medicalHistory?: string[];

  // Allergies - array of allergies (optional)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergies?: string[];

  // Emergency contact name (optional)
  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  // Emergency contact phone (optional)
  @IsString()
  @IsOptional()
  emergencyContactPhone?: string;

  // Date of birth (optional)
  @IsString()
  @IsOptional()
  dob?: string;

  // Address (optional)
  @IsString()
  @IsOptional()
  address?: string;
}
