// OTP DTO - OTP verify karne ke liye
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class OtpDto {
  // Email field - jis email par OTP bheja gaya tha
  @IsString()
  @IsNotEmpty({ message: 'Email zaroori hai' })
  email: string;

  // OTP field - 6 digit code
  @IsString()
  @IsNotEmpty({ message: 'OTP zaroori hai' })
  @MinLength(6, { message: 'OTP 6 digits ka hona chahiye' })
  otp: string;
}
