// Auth Service - Authentication logic handle karne ke liye
import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './entities/user.entity';
import { Patient, PatientDocument } from './entities/patient.entity';
import { Doctor, DoctorDocument } from './entities/doctor.entity';
import { LoginDto } from './dto/login.dto';
import { PatientRegisterDto } from './dto/patient-register.dto';
import { DoctorRegisterDto } from './dto/doctor-register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { OtpDto } from './dto/otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  // Login method - User login karke JWT token generate karega
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Database se user lein
    const user = await this.userModel.findOne({ email });

    // Agar user nahi mila, toh error throw karein
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Password verify karein
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Agar password galat hai, toh error throw karein
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Agar user inactive hai, toh error throw karein
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // JWT token generate karein
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    // User data aur token return karein
    return {
      access_token: token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone,
      },
    };
  }

  // Patient Register method - Naye patient ko register karega
  async patientRegister(patientRegisterDto: PatientRegisterDto) {
    const { email, password, name, phone, cnic, dob, fatherName, age, bloodGroup } = patientRegisterDto;

    // Check karein ke email already registered hai ya nahi
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Check karein ke CNIC already registered hai ya nahi
    const existingPatient = await this.patientModel.findOne({ cnic });
    if (existingPatient) {
      throw new ConflictException('CNIC already registered');
    }

    // Password hash karein
    const hashedPassword = await bcrypt.hash(password, 10);

    // User create karein
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      role: 'patient',
      name,
      phone,
    });

    // Patient profile create karein
    const patient = await this.patientModel.create({
      userId: user._id.toString(),
      cnic,
      dob: new Date(dob),
      fatherName,
      age,
      bloodGroup,
    });

    // JWT token generate karein
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    // User data aur token return karein
    return {
      access_token: token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone,
      },
    };
  }

  // Doctor Register method - Naye doctor ko register karega
  async doctorRegister(doctorRegisterDto: DoctorRegisterDto) {
    const {
      email,
      password,
      name,
      phone,
      pmdcLicenceNumber,
      specialization,
      qualification,
      experience,
      clinic,
      fee,
      bio,
      availableDays,
    } = doctorRegisterDto;

    // Check karein ke email already registered hai ya nahi
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Check karein ke PMDC license already registered hai ya nahi
    const existingDoctor = await this.doctorModel.findOne({ pmdcLicenceNumber });
    if (existingDoctor) {
      throw new ConflictException('PMDC License already registered');
    }

    // Password hash karein
    const hashedPassword = await bcrypt.hash(password, 10);

    // User create karein
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      role: 'doctor',
      name,
      phone,
    });

    // Doctor profile create karein
    const doctor = await this.doctorModel.create({
      userId: user._id.toString(),
      pmdcLicenceNumber,
      specialization,
      qualification,
      experience,
      clinic,
      fee,
      bio,
      availableDays,
    });

    // JWT token generate karein
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    // User data aur token return karein
    return {
      access_token: token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone,
      },
    };
  }

  // Forgot Password method - OTP generate karke email par bhejega
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    // User lein database se
    const user = await this.userModel.findOne({ email });

    // Agar user nahi mila, toh bhi success message dein (security ke liye)
    if (!user) {
      return { message: 'If email exists, OTP will be sent' };
    }

    // 6-digit OTP generate karein
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP expiration time set karein (15 minutes)
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    // User document mein OTP save karein
    await this.userModel.findByIdAndUpdate(user._id, {
      otp,
      otpExpires,
    });

    // Yahan par actual email sending logic hoga (nodemailer ya koi aur service)
    // Abhi ke liye console par print kar rahe hain
    console.log(`OTP for ${email}: ${otp}`);

    return { message: 'OTP sent to your email' };
  }

  // Verify OTP method - OTP validate karega
  async verifyOtp(otpDto: OtpDto) {
    const { email, otp } = otpDto;

    // User lein database se
    const user = await this.userModel.findOne({ email });

    // Agar user nahi mila, toh error throw karein
    if (!user) {
      throw new BadRequestException('Invalid email or OTP');
    }

    // Check karein ke OTP match kar raha hai ya nahi
    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // Check karein ke OTP expire nahi hua
    if (user.otpExpires && user.otpExpires < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    return { message: 'OTP verified successfully' };
  }

  // Reset Password method - Naya password set karega
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, otp, newPassword } = resetPasswordDto;

    // User lein database se
    const user = await this.userModel.findOne({ email });

    // Agar user nahi mila, toh error throw karein
    if (!user) {
      throw new BadRequestException('Invalid email or OTP');
    }

    // Check karein ke OTP match kar raha hai ya nahi
    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // Check karein ke OTP expire nahi hua
    if (user.otpExpires && user.otpExpires < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    // Naya password hash karein
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Password update karein aur OTP clear karein
    await this.userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      otp: null,
      otpExpires: null,
    });

    return { message: 'Password reset successfully' };
  }

  // Validate User method - JWT strategy ke liye helper function
  async validateUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user || !user.isActive) {
      return null;
    }
    return user;
  }
}
