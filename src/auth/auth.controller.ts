// Auth Controller - Authentication endpoints handle karne ke liye
import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PatientRegisterDto } from './dto/patient-register.dto';
import { DoctorRegisterDto } from './dto/doctor-register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { OtpDto } from './dto/otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Login endpoint - User login karke JWT token receive karega
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Patient Registration endpoint - Naye patient ko register karega
  @Public()
  @Post('register/patient')
  async patientRegister(@Body() patientRegisterDto: PatientRegisterDto) {
    return this.authService.patientRegister(patientRegisterDto);
  }

  // Doctor Registration endpoint - Naye doctor ko register karega
  @Public()
  @Post('register/doctor')
  async doctorRegister(@Body() doctorRegisterDto: DoctorRegisterDto) {
    return this.authService.doctorRegister(doctorRegisterDto);
  }

  // Forgot Password endpoint - OTP generate karke email par bhejega
  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  // Verify OTP endpoint - OTP validate karega
  @Public()
  @Post('verify-otp')
  async verifyOtp(@Body() otpDto: OtpDto) {
    return this.authService.verifyOtp(otpDto);
  }

  // Reset Password endpoint - Naya password set karega
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  // Get Current User endpoint - Current logged-in user ki info dega
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req) {
    return {
      user: req.user,
    };
  }
}
