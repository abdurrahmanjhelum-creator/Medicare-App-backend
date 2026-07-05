// Appointments Service - Appointment logic handle karne ke liye
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './entities/appointment.entity';
import { Doctor, DoctorDocument } from '../auth/entities/doctor.entity';
import { User, UserDocument } from '../auth/entities/user.entity';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { GetAppointmentsDto } from './dto/get-appointments.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private notificationsService: NotificationsService,
  ) {}

  // Book Appointment method - Naya appointment book karega
  async bookAppointment(patientId: string, bookAppointmentDto: BookAppointmentDto) {
    const { doctorId, date, time, type, patientNotes } = bookAppointmentDto;

    // Doctor lein database se
    const doctor = await this.doctorModel.findOne({ userId: doctorId });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Patient lein database se
    const patient = await this.userModel.findById(patientId);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const doctorUser = await this.userModel.findById(doctorId);

    // Check karein ke doctor us din available hai ya nahi
    const appointmentDate = new Date(date);
    const dayFull = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' }); // "Monday"
    const dayShort = appointmentDate.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon"
    const dayAvailable = doctor.availableDays.some(
      (d) => d.toLowerCase() === dayFull.toLowerCase() || d.toLowerCase() === dayShort.toLowerCase()
    );
    if (!dayAvailable) {
      throw new BadRequestException(`Doctor is not available on ${dayFull}`);
    }

    // Check karein ke time slot already booked hai ya nahi
    const existingAppointment = await this.appointmentModel.findOne({
      doctorId,
      date: appointmentDate,
      time,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingAppointment) {
      throw new BadRequestException('This time slot is already booked');
    }

    // Appointment create karein
    const appointment = await this.appointmentModel.create({
      patientId,
      patientName: patient.name,
      doctorId,
      doctorName: doctorUser?.name || doctor.clinic,
      specialization: doctor.specialization,
      time,
      date: appointmentDate,
      type,
      location: doctor.clinic,
      status: 'pending',
      patientNotes,
    });

    // Doctor ko notification bhejein
    await this.notificationsService.createNotification(
      doctorId,
      'New Appointment Booked',
      `${patient.name} has booked an appointment with you on ${appointmentDate.toLocaleDateString()} at ${time}`,
      'appointment',
      appointment._id.toString(),
    );

    return {
      message: 'Appointment booked successfully',
      appointment,
    };
  }

  // Get Appointments method - Patient ke saare appointments lein with filters
  async getAppointments(patientId: string, getAppointmentsDto: GetAppointmentsDto) {
    const { status, startDate, endDate } = getAppointmentsDto;

    // Query build karein
    const query: any = { patientId };

    // Status filter apply karein
    if (status && status !== 'all') {
      query.status = status;
    }

    // Date range filter apply karein
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Appointments lein database se, sorted by date
    const appointments = await this.appointmentModel
      .find(query)
      .sort({ date: 1, time: 1 })
      .exec();

    return {
      appointments,
      total: appointments.length,
    };
  }

  // Cancel Appointment method - Appointment cancel karega
  async cancelAppointment(patientId: string, cancelAppointmentDto: CancelAppointmentDto) {
    const { appointmentId, reason } = cancelAppointmentDto;

    // Appointment lein database se
    const appointment = await this.appointmentModel.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Check karein ke appointment is patient ki hai
    if (appointment.patientId !== patientId) {
      throw new ForbiddenException('You can only cancel your own appointments');
    }

    // Check karein ke appointment already cancelled ya completed hai
    if (appointment.status === 'cancelled') {
      throw new BadRequestException('Appointment is already cancelled');
    }

    if (appointment.status === 'completed') {
      throw new BadRequestException('Cannot cancel completed appointment');
    }

    // Appointment status update karein
    appointment.status = 'cancelled';
    appointment.cancellationReason = reason;
    await appointment.save();

    return {
      message: 'Appointment cancelled successfully',
      appointment,
    };
  }

  // Get Appointment By ID method - Single appointment ki details lein
  async getAppointmentById(patientId: string, appointmentId: string) {
    // Appointment lein database se
    const appointment = await this.appointmentModel.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Check karein ke appointment is patient ki hai
    if (appointment.patientId !== patientId) {
      throw new ForbiddenException('You can only view your own appointments');
    }

    return { appointment };
  }

  // Get Doctor Appointments method - Doctor ke saare appointments lein (for doctor dashboard)
  async getDoctorAppointments(doctorId: string, getAppointmentsDto: GetAppointmentsDto) {
    const { status, startDate, endDate } = getAppointmentsDto;

    // Query build karein
    const query: any = { doctorId };

    // Status filter apply karein
    if (status && status !== 'all') {
      if (status === 'upcoming') {
        query.status = { $in: ['pending', 'confirmed'] };
      } else if (status === 'cancelled') {
        query.status = { $in: ['cancelled', 'rejected'] };
      } else {
        query.status = status;
      }
    }

    // Date range filter apply karein
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Appointments lein database se, sorted by date
    const appointments = await this.appointmentModel
      .find(query)
      .sort({ date: 1, time: 1 })
      .exec();

    return {
      appointments,
      total: appointments.length,
    };
  }

  // Update Appointment Status method - Doctor appointment status update karega
  async updateAppointmentStatus(doctorId: string, appointmentId: string, status: string, doctorNotes?: string) {
    // Appointment lein database se
    const appointment = await this.appointmentModel.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Check karein ke appointment is doctor ki hai
    if (appointment.doctorId !== doctorId) {
      throw new ForbiddenException('You can only update your own appointments');
    }

    // Status validate karein
    const validStatuses = ['confirmed', 'completed', 'rejected', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    // Appointment status update karein
    appointment.status = status as any;
    if (doctorNotes) {
      appointment.doctorNotes = doctorNotes;
    }
    await appointment.save();

    // Patient ko notification bhejein
    let notificationTitle = '';
    let notificationMessage = '';
    
    if (status === 'confirmed') {
      notificationTitle = 'Appointment Confirmed';
      notificationMessage = `Your appointment with ${appointment.doctorName} on ${appointment.date.toLocaleDateString()} at ${appointment.time} has been confirmed.`;
    } else if (status === 'completed') {
      notificationTitle = 'Appointment Completed';
      notificationMessage = `Your appointment with ${appointment.doctorName} has been completed.`;
    } else if (status === 'cancelled') {
      notificationTitle = 'Appointment Cancelled';
      notificationMessage = `Your appointment with ${appointment.doctorName} on ${appointment.date.toLocaleDateString()} at ${appointment.time} has been cancelled.`;
    } else if (status === 'rejected') {
      notificationTitle = 'Appointment Rejected';
      notificationMessage = `Your appointment with ${appointment.doctorName} on ${appointment.date.toLocaleDateString()} at ${appointment.time} has been rejected.`;
    }

    await this.notificationsService.createNotification(
      appointment.patientId,
      notificationTitle,
      notificationMessage,
      'appointment',
      appointment._id.toString(),
    );

    return {
      message: 'Appointment status updated successfully',
      appointment,
    };
  }
}
