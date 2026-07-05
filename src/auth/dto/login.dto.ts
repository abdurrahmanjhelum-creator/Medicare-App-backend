// Login DTO - User login ke liye data validation
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  // Email field - valid email hona chahiye
  @IsEmail({}, { message: 'Email valid hona chahiye' })
  @IsNotEmpty({ message: 'Email zaroori hai' })
  email: string;

  // Password field - kam se kam 6 characters hona chahiye
  @IsString()
  @IsNotEmpty({ message: 'Password zaroori hai' })
  @MinLength(6, { message: 'Password kam se kam 6 characters ka hona chahiye' })
  password: string;
}
