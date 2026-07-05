// Update Profile DTO - Doctor profile update karne ke liye
import { IsOptional, IsString, IsNumber, Min, IsArray } from 'class-validator';

export class UpdateProfileDto {
  // Doctor ka naam (optional)
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

  // Specialization - doctor ki expertise (optional)
  @IsString()
  @IsOptional()
  specialization?: string;

  // Qualification - doctor ki degree (optional)
  @IsString()
  @IsOptional()
  qualification?: string;

  // Experience - years mein (optional)
  @IsNumber()
  @Min(0)
  @IsOptional()
  experience?: number;

  // Clinic/Hospital ka naam (optional)
  @IsString()
  @IsOptional()
  clinic?: string;

  // Consultation fee (optional)
  @IsNumber()
  @Min(0)
  @IsOptional()
  fee?: number;

  // Doctor ka bio/description (optional)
  @IsString()
  @IsOptional()
  bio?: string;
}
