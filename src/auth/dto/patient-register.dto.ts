// Patient Registration DTO - Naye patient register karne ke liye data validation
import { IsEmail, IsNotEmpty, IsString, MinLength, IsInt, Min, Max, IsOptional, Matches } from 'class-validator';

export class PatientRegisterDto {
  // Email field - unique aur valid email hona chahiye
  @IsEmail({}, { message: 'Email valid hona chahiye' })
  @IsNotEmpty({ message: 'Email zaroori hai' })
  email: string;

  // Password field - kam se kam 6 characters
  @IsString()
  @IsNotEmpty({ message: 'Password zaroori hai' })
  @MinLength(6, { message: 'Password kam se kam 6 characters ka hona chahiye' })
  password: string;

  // Patient ka naam
  @IsString()
  @IsNotEmpty({ message: 'Naam zaroori hai' })
  name: string;

  // Phone number
  @IsString()
  @IsNotEmpty({ message: 'Phone number zaroori hai' })
  @Matches(/^03[0-9]{9}$/, { message: 'Phone number valid Pakistani format mein hona chahiye (03XXXXXXXXX)' })
  phone: string;

  // CNIC number - 13 digits without dashes
  @IsString()
  @IsNotEmpty({ message: 'CNIC zaroori hai' })
  @Matches(/^[0-9]{13}$/, { message: 'CNIC 13 digits ka hona chahiye' })
  cnic: string;

  // Date of birth
  @IsString()
  @IsNotEmpty({ message: 'Date of birth zaroori hai' })
  dob: string;

  // Father's name
  @IsString()
  @IsNotEmpty({ message: 'Father ka naam zaroori hai' })
  fatherName: string;

  // Age - positive number
  @IsInt()
  @Min(1, { message: 'Age 1 se bara hona chahiye' })
  @Max(120, { message: 'Age 120 se chota hona chahiye' })
  age: number;

  // Blood group - optional field
  @IsString()
  @IsOptional()
  bloodGroup?: string;
}
