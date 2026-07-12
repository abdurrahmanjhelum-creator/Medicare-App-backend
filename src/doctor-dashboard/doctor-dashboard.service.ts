// Doctor Dashboard Service - 100% Fixed and Optimized
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from '../auth/entities/doctor.entity';
import { User, UserDocument } from '../auth/entities/user.entity';
import { Appointment, AppointmentDocument } from '../appointments/entities/appointment.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { GetEarningsDto } from './dto/get-earnings.dto';

@Injectable()
export class DoctorDashboardService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async getProfile(userId: string) {
    const doctor = await this.doctorModel.findOne({ userId });
    if (!doctor) throw new NotFoundException('Doctor profile not found');
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return {
      user: { id: user._id.toString(), email: user.email, name: user.name, phone: user.phone, profileImage: user.profileImage },
      doctor: { 
        id: doctor._id.toString(), pmdcLicenceNumber: doctor.pmdcLicenceNumber, specialization: doctor.specialization, 
        qualification: doctor.qualification, experience: doctor.experience, clinic: doctor.clinic, 
        clinicAddress: doctor.clinicAddress, fee: doctor.fee, bio: doctor.bio, availableDays: doctor.availableDays, 
        availableSlots: doctor.availableSlots, rating: doctor.rating, totalReviews: doctor.totalReviews, isVerified: doctor.isVerified 
      },
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const doctor = await this.doctorModel.findOne({ userId });
    if (!doctor) throw new NotFoundException('Doctor profile not found');
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (updateProfileDto.name) user.name = updateProfileDto.name;
    if (updateProfileDto.phone) user.phone = updateProfileDto.phone;
    if (updateProfileDto.profileImage) user.profileImage = updateProfileDto.profileImage;
    await user.save();

    if (updateProfileDto.specialization) doctor.specialization = updateProfileDto.specialization;
    if (updateProfileDto.qualification) doctor.qualification = updateProfileDto.qualification;
    if (updateProfileDto.experience !== undefined) doctor.experience = updateProfileDto.experience;
    if (updateProfileDto.clinic) doctor.clinic = updateProfileDto.clinic;
    if (updateProfileDto.clinicAddress) doctor.clinicAddress = updateProfileDto.clinicAddress;
    if (updateProfileDto.fee !== undefined) doctor.fee = updateProfileDto.fee;
    if (updateProfileDto.bio) doctor.bio = updateProfileDto.bio;
    await doctor.save();

    return { message: 'Profile updated successfully' };
  }

  async updateSchedule(userId: string, updateScheduleDto: UpdateScheduleDto) {
    const doctor = await this.doctorModel.findOne({ userId });
    if (!doctor) throw new NotFoundException('Doctor profile not found');
    if (updateScheduleDto.availableDays) doctor.availableDays = updateScheduleDto.availableDays;
    if (updateScheduleDto.availableSlots) doctor.availableSlots = updateScheduleDto.availableSlots;
    await doctor.save();
    return { message: 'Schedule updated successfully' };
  }

  async getEarnings(userId: string, getEarningsDto: GetEarningsDto) {
    const doctor = await this.doctorModel.findOne({ userId });
    if (!doctor) throw new NotFoundException('Doctor profile not found');
    // appointments store doctorId = userId, not doctor._id
    const query: any = { doctorId: userId, status: 'completed' };
    if (getEarningsDto.startDate || getEarningsDto.endDate) {
      query.date = {};
      if (getEarningsDto.startDate) query.date.$gte = new Date(getEarningsDto.startDate);
      if (getEarningsDto.endDate) query.date.$lte = new Date(getEarningsDto.endDate);
    }
    const appointments = await this.appointmentModel.find(query).exec();
    return { totalEarnings: appointments.length * doctor.fee, totalAppointments: appointments.length, feePerAppointment: doctor.fee };
  }

  async getStats(userId: string) {
    const doctor = await this.doctorModel.findOne({ userId });
    if (!doctor) throw new NotFoundException('Doctor profile not found');
    const doctorId = userId;

    const pkOffset = 5 * 60 * 60 * 1000;
    const nowPk = new Date(Date.now() + pkOffset);

    const startOfToday = new Date(Date.UTC(nowPk.getUTCFullYear(), nowPk.getUTCMonth(), nowPk.getUTCDate(), 0, 0, 0));
    const endOfToday = new Date(Date.UTC(nowPk.getUTCFullYear(), nowPk.getUTCMonth(), nowPk.getUTCDate(), 23, 59, 59, 999));

    const dayOfWeek = nowPk.getUTCDay();
    const diff = nowPk.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startOfWeek = new Date(Date.UTC(nowPk.getUTCFullYear(), nowPk.getUTCMonth(), diff, 0, 0, 0));

    const [totalAppointments, completedCount, confirmedCount, cancelledCount, pendingCount, todayCount, todayCompletedCount, uniquePatients, thisWeekCount] = await Promise.all([
      this.appointmentModel.countDocuments({ doctorId }),
      this.appointmentModel.countDocuments({ doctorId, status: 'completed' }),
      this.appointmentModel.countDocuments({ doctorId, status: 'confirmed' }),
      this.appointmentModel.countDocuments({ doctorId, status: { $in: ['cancelled', 'rejected'] } }),
      this.appointmentModel.countDocuments({ doctorId, status: 'pending' }),
      this.appointmentModel.countDocuments({ doctorId, date: { $gte: startOfToday, $lte: endOfToday } }),
      this.appointmentModel.countDocuments({ doctorId, status: 'completed', date: { $gte: startOfToday, $lte: endOfToday } }),
      this.appointmentModel.distinct('patientId', { doctorId }),
      this.appointmentModel.countDocuments({ doctorId, date: { $gte: startOfWeek } }),
    ]);

    const earningsChart = await this._getEarningsChartData(doctorId, doctor.fee);

    const recentAppointments = await this.appointmentModel
      .find({ doctorId })
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .select('patientId patientName date time type status patientNotes')
      .lean()
      .exec();

    return {
      totalAppointments,
      completedAppointments: completedCount,
      upcomingAppointments: pendingCount + confirmedCount,
      cancelledAppointments: cancelledCount,
      pendingAppointments: pendingCount,
      todaysAppointmentsCount: todayCount,
      totalPatients: uniquePatients.length,
      totalEarnings: completedCount * doctor.fee,
      todayEarnings: todayCompletedCount * doctor.fee,
      thisWeekAppointments: thisWeekCount,
      recentAppointments,
      earningsChart,
    };
  }

  private async _getEarningsChartData(doctorId: string, fee: number) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = [];
    const pkOffset = 5 * 60 * 60 * 1000;
    const nowPk = new Date(Date.now() + pkOffset);

    for (let i = 6; i >= 0; i--) {
      // Find date of i days ago in PKT
      const dPk = new Date(nowPk.getTime() - i * 24 * 60 * 60 * 1000);
      const d = new Date(Date.UTC(dPk.getUTCFullYear(), dPk.getUTCMonth(), dPk.getUTCDate(), 0, 0, 0));
      const nextD = new Date(d);
      nextD.setUTCDate(d.getUTCDate() + 1);

      const count = await this.appointmentModel.countDocuments({
        doctorId,
        status: 'completed',
        date: { $gte: d, $lt: nextD },
      });
      data.push({ date: days[d.getUTCDay()], amount: count * fee });
    }
    return data;
  }
}
