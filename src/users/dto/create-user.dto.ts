// Create User DTO - Naya user create karne ke liye (admin use)
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';

export class CreateUserDto {
  // Email - user ka email
  @IsEmail({}, { message: 'Valid email zaroori hai' })
  @IsNotEmpty({ message: 'Email zaroori hai' })
  email: string;

  // Password - user ka password
  @IsString()
  @IsNotEmpty({ message: 'Password zaroori hai' })
  @MinLength(6, { message: 'Password kam se kam 6 characters ka hona chahiye' })
  password: string;

  // Name - user ka naam
  @IsString()
  @IsNotEmpty({ message: 'Name zaroori hai' })
  name: string;

  // Phone - user ka phone number
  @IsString()
  @IsNotEmpty({ message: 'Phone number zaroori hai' })
  phone: string;

  // Role - user ka role (patient, doctor, admin)
  @IsString()
  @IsNotEmpty({ message: 'Role zaroori hai' })
  role: string;
}
