// Patients Service - Patient management logic handle karne ke liye
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from '../auth/entities/patient.entity';
import { User, UserDocument } from '../auth/entities/user.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Get Patient Profile method - Patient ka complete profile lein
  async getPatientProfile(userId: string) {
    // Patient lein database se
    const patient = await this.patientModel.findOne({ userId });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    // User lein database se
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Patient aur user data combine karke return karein
    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        phone: user.phone,
        profileImage: user.profileImage,
      },
      patient: {
        id: patient._id.toString(),
        cnic: patient.cnic,
        dob: patient.dob,
        fatherName: patient.fatherName,
        age: patient.age,
        bloodGroup: patient.bloodGroup,
        medicalHistory: patient.medicalHistory,
        allergies: patient.allergies,
        emergencyContactName: patient.emergencyContactName,
        emergencyContactPhone: patient.emergencyContactPhone,
        address: patient.address,
      },
    };
  }

  // Update Patient Profile method - Patient ka profile update karein
  async updatePatientProfile(userId: string, updateProfileDto: any) {
    // Patient lein database se
    const patient = await this.patientModel.findOne({ userId });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
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

    // Patient data update karein (agar provided hai)
    if (updateProfileDto.bloodGroup !== undefined) {
      patient.bloodGroup = updateProfileDto.bloodGroup;
    }
    if (updateProfileDto.medicalHistory !== undefined) {
      patient.medicalHistory = updateProfileDto.medicalHistory;
    }
    if (updateProfileDto.allergies !== undefined) {
      patient.allergies = updateProfileDto.allergies;
    }
    if (updateProfileDto.emergencyContactName !== undefined) {
      patient.emergencyContactName = updateProfileDto.emergencyContactName;
    }
    if (updateProfileDto.emergencyContactPhone !== undefined) {
      patient.emergencyContactPhone = updateProfileDto.emergencyContactPhone;
    }
    if (updateProfileDto.address !== undefined) {
      patient.address = updateProfileDto.address;
    }
    await patient.save();

    return {
      message: 'Profile updated successfully',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        phone: user.phone,
        profileImage: user.profileImage,
      },
      patient: {
        id: patient._id.toString(),
        cnic: patient.cnic,
        dob: patient.dob,
        fatherName: patient.fatherName,
        age: patient.age,
        bloodGroup: patient.bloodGroup,
        medicalHistory: patient.medicalHistory,
        allergies: patient.allergies,
        emergencyContactName: patient.emergencyContactName,
        emergencyContactPhone: patient.emergencyContactPhone,
        address: patient.address,
      },
    };
  }

  /** Resolve patient by MongoDB _id or by linked userId (appointments store userId as patientId). */
  private async resolvePatient(patientIdOrUserId: string) {
    let patient = await this.patientModel.findById(patientIdOrUserId);
    if (!patient) {
      patient = await this.patientModel.findOne({ userId: patientIdOrUserId });
    }
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  // Get Patient By ID method - Doctor patient ki details le sakta hai
  async getPatientById(patientId: string) {
    const patient = await this.resolvePatient(patientId);

    const user = await this.userModel.findById(patient.userId);
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
      patient: {
        id: patient._id.toString(),
        userId: patient.userId,
        dob: patient.dob,
        age: patient.age,
        bloodGroup: patient.bloodGroup,
        medicalHistory: patient.medicalHistory,
        allergies: patient.allergies,
        emergencyContactName: patient.emergencyContactName,
        emergencyContactPhone: patient.emergencyContactPhone,
        address: patient.address,
      },
    };
  }
}
