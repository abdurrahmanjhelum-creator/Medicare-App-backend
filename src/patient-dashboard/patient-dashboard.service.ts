// Patient Dashboard Service - Patient dashboard logic handle karne ke liye
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from '../auth/entities/patient.entity';
import { User, UserDocument } from '../auth/entities/user.entity';
import { Appointment, AppointmentDocument } from '../appointments/entities/appointment.entity';
import { MedicalRecord, MedicalRecordDocument } from '../medical-records/medical-records.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class PatientDashboardService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    @InjectModel('MedicalRecord') private medicalRecordModel: Model<MedicalRecordDocument>,
  ) {}

  // Get Profile method - Patient ka complete profile lein
  async getProfile(userId: string) {
    // User lein database se
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Patient lein database se (optional)
    const patient = await this.patientModel.findOne({ userId });

    // User aur patient data (agar available ho) combine karke return karein
    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        phone: user.phone,
        profileImage: user.profileImage,
      },
      patient: patient ? {
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
      } : null,
    };
  }

  // Update Profile method - Patient ka profile update karein
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    let patient = await this.patientModel.findOne({ userId });
    if (!patient) {
      patient = await this.patientModel.create({
        userId,
        dob: new Date(),
      });
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
    if (updateProfileDto.dob !== undefined) {
      try {
        const parsed = new Date(updateProfileDto.dob);
        if (isNaN(parsed.getTime())) {
          throw new BadRequestException('Invalid date format for dob');
        }
        patient.dob = parsed;
      } catch (err) {
        if (err instanceof BadRequestException) throw err;
        throw new BadRequestException('Invalid date format for dob');
      }
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

  // Get Dashboard Stats method - Patient ke dashboard statistics lein
  async getDashboardStats(userId: string) {
    // Patient lein database se
    const patient = await this.patientModel.findOne({ userId });
    if (!patient) {
      // Return zeros instead of throwing to allow frontend to show empty state
      return {
        totalAppointments: 0,
        upcomingAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
        totalMedicalRecords: 0,
        totalDoctorsVisited: 0,
        totalPrescriptions: 0,
      };
    }

    // Total appointments count karein
    const totalAppointments = await this.appointmentModel.countDocuments({
      patientId: patient._id.toString(),
    });

    // Upcoming appointments count karein
    const upcomingAppointments = await this.appointmentModel.countDocuments({
      patientId: patient._id.toString(),
      status: { $in: ['pending', 'confirmed'] },
      date: { $gte: new Date() },
    });

    // Completed appointments count karein
    const completedAppointments = await this.appointmentModel.countDocuments({
      patientId: patient._id.toString(),
      status: 'completed',
    });

    // Cancelled appointments count karein
    const cancelledAppointments = await this.appointmentModel.countDocuments({
      patientId: patient._id.toString(),
      status: 'cancelled',
    });

    // Medical records count karein
    const medicalRecords = await this.medicalRecordModel.countDocuments({
      patientId: patient._id.toString(),
    });

    // Prescriptions count - records with non-empty prescription
    const prescriptionCount = await this.medicalRecordModel.countDocuments({
      patientId: patient._id.toString(),
      prescription: { $exists: true, $ne: '' },
    });

    // Unique doctors count karein
    const uniqueDoctors = await this.appointmentModel.distinct('doctorId', {
      patientId: patient._id.toString(),
    });

    return {
      totalAppointments,
      upcomingAppointments,
      completedAppointments,
      cancelledAppointments,
      totalMedicalRecords: medicalRecords,
      totalDoctorsVisited: uniqueDoctors.length,
      totalPrescriptions: prescriptionCount,
    };
  }

  // Get Upcoming Appointments method - Patient ke upcoming appointments lein
  async getUpcomingAppointments(userId: string) {
    // Patient lein database se
    const patient = await this.patientModel.findOne({ userId });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    // Upcoming appointments lein database se
    const appointments = await this.appointmentModel
      .find({
        patientId: patient._id.toString(),
        status: { $in: ['pending', 'confirmed'] },
        date: { $gte: new Date() },
      })
      .sort({ date: 1, time: 1 })
      .exec();

    return {
      appointments,
      total: appointments.length,
    };
  }

  // Get Medical History method - Patient ki medical history lein
  async getMedicalHistory(userId: string) {
    // Patient lein database se
    const patient = await this.patientModel.findOne({ userId });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    // Medical records lein database se
    const medicalRecords = await this.medicalRecordModel
      .find({ patientId: patient._id.toString() })
      .sort({ createdAt: -1 })
      .exec();

    return {
      medicalRecords,
      total: medicalRecords.length,
      medicalHistory: patient.medicalHistory,
      allergies: patient.allergies,
    };
  }
}
