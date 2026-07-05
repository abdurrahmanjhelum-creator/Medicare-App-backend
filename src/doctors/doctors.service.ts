// Doctors Service - Doctor management logic handle karne ke liye
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from '../auth/entities/doctor.entity';
import { User, UserDocument } from '../auth/entities/user.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Get All Doctors method - Saare doctors ki list lein with filters
  async getAllDoctors(query: any) {
    const { specialization, minRating, maxFee, search } = query;

    // Query build karein
    const filter: any = {};

    // Specialization filter
    if (specialization) {
      filter.specialization = { $regex: specialization, $options: 'i' };
    }

    // Rating filter
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    // Fee filter
    if (maxFee) {
      filter.fee = { $lte: parseFloat(maxFee) };
    }

    // Search filter (name ya specialization)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
      ];
    }

    // Doctors lein database se
    const doctors = await this.doctorModel.find(filter).sort({ rating: -1 }).exec();

    // User data add karein har doctor ke liye
    const doctorsWithUsers = await Promise.all(
      doctors.map(async (doctor) => {
        const user = await this.userModel.findById(doctor.userId);
        return {
          id: doctor._id.toString(),
          userId: doctor.userId,
          name: user?.name || doctor.clinic,
          email: user?.email,
          phone: user?.phone,
          profileImage: user?.profileImage,
          pmdcLicenceNumber: doctor.pmdcLicenceNumber,
          specialization: doctor.specialization,
          qualification: doctor.qualification,
          experience: doctor.experience,
          clinic: doctor.clinic,
          clinicAddress: doctor.clinicAddress,
          fee: doctor.fee,
          bio: doctor.bio,
          availableDays: doctor.availableDays,
          availableSlots: doctor.availableSlots,
          rating: doctor.rating,
          totalReviews: doctor.totalReviews,
          isVerified: doctor.isVerified,
        };
      }),
    );

    return {
      doctors: doctorsWithUsers,
      total: doctorsWithUsers.length,
    };
  }

  // Get Doctor By ID method - Doctor ki details lein by ID
  async getDoctorById(doctorId: string) {
    // Doctor lein database se
    const doctor = await this.doctorModel.findById(doctorId);
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // User lein database se
    const user = await this.userModel.findById(doctor.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: doctor._id.toString(),
      userId: doctor.userId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      pmdcLicenceNumber: doctor.pmdcLicenceNumber,
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experience: doctor.experience,
      clinic: doctor.clinic,
      clinicAddress: doctor.clinicAddress,
      fee: doctor.fee,
      bio: doctor.bio,
      availableDays: doctor.availableDays,
      availableSlots: doctor.availableSlots,
      rating: doctor.rating,
      totalReviews: doctor.totalReviews,
      isVerified: doctor.isVerified,
    };
  }

  // Get Doctor Profile method - Doctor ka apna profile lein
  async getDoctorProfile(userId: string) {
    // Doctor lein database se
    const doctor = await this.doctorModel.findOne({ userId });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    // User lein database se
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        phone: user.phone,
        profileImage: user.profileImage,
      },
      doctor: {
        id: doctor._id.toString(),
        pmdcLicenceNumber: doctor.pmdcLicenceNumber,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        experience: doctor.experience,
        clinic: doctor.clinic,
        clinicAddress: doctor.clinicAddress,
        fee: doctor.fee,
        bio: doctor.bio,
        availableDays: doctor.availableDays,
        availableSlots: doctor.availableSlots,
        rating: doctor.rating,
        totalReviews: doctor.totalReviews,
        isVerified: doctor.isVerified,
      },
    };
  }

  // Update Doctor Profile method - Doctor ka profile update karein
  async updateDoctorProfile(userId: string, updateProfileDto: any) {
    // Doctor lein database se
    const doctor = await this.doctorModel.findOne({ userId });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    // User lein database se
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // User data update karein (agar provided hai)
    if (updateProfileDto.name) {
      user.name = updateProfileDto.name;
    }
    if (updateProfileDto.phone) {
      user.phone = updateProfileDto.phone;
    }
    if (updateProfileDto.profileImage) {
      user.profileImage = updateProfileDto.profileImage;
    }
    await user.save();

    // Doctor data update karein (agar provided hai)
    if (updateProfileDto.specialization !== undefined) {
      doctor.specialization = updateProfileDto.specialization;
    }
    if (updateProfileDto.qualification !== undefined) {
      doctor.qualification = updateProfileDto.qualification;
    }
    if (updateProfileDto.experience !== undefined) {
      doctor.experience = updateProfileDto.experience;
    }
    if (updateProfileDto.clinic !== undefined) {
      doctor.clinic = updateProfileDto.clinic;
    }
    if (updateProfileDto.clinicAddress !== undefined) {
      doctor.clinicAddress = updateProfileDto.clinicAddress;
    }
    if (updateProfileDto.fee !== undefined) {
      doctor.fee = updateProfileDto.fee;
    }
    if (updateProfileDto.bio !== undefined) {
      doctor.bio = updateProfileDto.bio;
    }
    if (updateProfileDto.availableDays !== undefined) {
      doctor.availableDays = updateProfileDto.availableDays;
    }
    if (updateProfileDto.availableSlots !== undefined) {
      doctor.availableSlots = updateProfileDto.availableSlots;
    }
    await doctor.save();

    return {
      message: 'Profile updated successfully',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        phone: user.phone,
        profileImage: user.profileImage,
      },
      doctor: {
        id: doctor._id.toString(),
        pmdcLicenceNumber: doctor.pmdcLicenceNumber,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        experience: doctor.experience,
        clinic: doctor.clinic,
        clinicAddress: doctor.clinicAddress,
        fee: doctor.fee,
        bio: doctor.bio,
        availableDays: doctor.availableDays,
        availableSlots: doctor.availableSlots,
        rating: doctor.rating,
        totalReviews: doctor.totalReviews,
        isVerified: doctor.isVerified,
      },
    };
  }
}
