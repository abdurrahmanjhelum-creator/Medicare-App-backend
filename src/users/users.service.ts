// Users Service - User management logic handle karne ke liye
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/entities/user.entity';
import { Patient, PatientDocument } from '../auth/entities/patient.entity';
import { Doctor, DoctorDocument } from '../auth/entities/doctor.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  // Get Profile method - Current user ka profile lein
  async getProfile(userId: string) {
    // User lein database se
    const user = await this.userModel.findById(userId).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Agar patient hai, toh patient details bhi lein
    let patientDetails = null;
    let doctorDetails = null;

    if (user.role === 'patient') {
      patientDetails = await this.patientModel.findOne({ userId }).exec();
    } else if (user.role === 'doctor') {
      doctorDetails = await this.doctorModel.findOne({ userId }).exec();
    }

    return {
      user,
      patientDetails,
      doctorDetails,
    };
  }

  // Update Profile method - User profile update karein
  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const { name, phone, address, profileImage } = updateUserDto;

    // User lein database se
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // User details update karein
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profileImage) user.profileImage = profileImage;
    await user.save();

    // Agar patient hai, toh patient details bhi update karein
    if (user.role === 'patient') {
      const patient = await this.patientModel.findOne({ userId });
      if (patient) {
        if (address) patient.address = address;
        await patient.save();
      }
    }

    return {
      message: 'Profile updated successfully',
      user,
    };
  }

  // Change Password method - User ka password change karein
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    // Confirm password match karein
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New password aur confirm password match nahi kar rahe');
    }

    // User lein database se
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Current password verify karein
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password galat hai');
    }

    // Naya password hash karein
    const hashedPassword = await this.hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    return {
      message: 'Password changed successfully',
    };
  }

  // Get User By ID method - User lein by ID (admin use)
  async getUserById(userId: string) {
    // User lein database se
    const user = await this.userModel.findById(userId).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { user };
  }

  // Delete User method - User delete karein (admin use)
  async deleteUser(userId: string) {
    // User lein database se
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // User delete karein
    await this.userModel.findByIdAndDelete(userId);

    // Agar patient hai, toh patient record bhi delete karein
    if (user.role === 'patient') {
      await this.patientModel.deleteOne({ userId });
    } else if (user.role === 'doctor') {
      await this.doctorModel.deleteOne({ userId });
    }

    return {
      message: 'User deleted successfully',
    };
  }

  // Hash Password helper method - Password hash karein
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
