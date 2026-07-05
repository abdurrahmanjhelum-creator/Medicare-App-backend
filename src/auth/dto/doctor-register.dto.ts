// Doctor Registration DTO - Naye doctor register karne ke liye data validation
import { IsEmail, IsNotEmpty, IsString, MinLength, IsInt, Min, Max, IsArray, IsNumber, Matches } from 'class-validator';

export class DoctorRegisterDto {
  // Email field - unique aur valid email
  @IsEmail({}, { message: 'Email valid hona chahiye' })
  @IsNotEmpty({ message: 'Email zaroori hai' })
  email: string;

  // Password field - kam se kam 6 characters
  @IsString()
  @IsNotEmpty({ message: 'Password zaroori hai' })
  @MinLength(6, { message: 'Password kam se kam 6 characters ka hona chahiye' })
  password: string;

  // Doctor ka naam
  @IsString()
  @IsNotEmpty({ message: 'Naam zaroori hai' })
  name: string;

  // Phone number
  @IsString()
  @IsNotEmpty({ message: 'Phone number zaroori hai' })
  @Matches(/^03[0-9]{9}$/, { message: 'Phone number valid Pakistani format mein hona chahiye (03XXXXXXXXX)' })
  phone: string;

  // PMDC License number - unique identifier for doctor
  @IsString()
  @IsNotEmpty({ message: 'PMDC license number zaroori hai' })
  pmdcLicenceNumber: string;

  // Specialization - doctor ki expertise
  @IsString()
  @IsNotEmpty({ message: 'Specialization zaroori hai' })
  specialization: string;

  // Qualification - doctor ki degree
  @IsString()
  @IsNotEmpty({ message: 'Qualification zaroori hai' })
  qualification: string;

  // Experience - years mein
  @IsInt()
  @Min(0, { message: 'Experience 0 ya positive hona chahiye' })
  @Max(50, { message: 'Experience 50 se zyada nahi ho sakta' })
  experience: number;

  // Clinic/Hospital ka naam
  @IsString()
  @IsNotEmpty({ message: 'Clinic/Hospital ka naam zaroori hai' })
  clinic: string;

  // Consultation fee
  @IsNumber()
  @Min(0, { message: 'Fee positive hona chahiye' })
  fee: number;

  // Doctor ka bio/description
  @IsString()
  @IsNotEmpty({ message: 'Bio zaroori hai' })
  bio: string;

  // Available days - array of days (e.g., ['Monday', 'Tuesday'])
  @IsArray()
  @IsString({ each: true })
  availableDays: string[];
}
