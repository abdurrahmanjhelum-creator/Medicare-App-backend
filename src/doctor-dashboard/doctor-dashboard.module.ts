// Doctor Dashboard Module - Doctor dashboard module configuration
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorDashboardController } from './doctor-dashboard.controller';
import { DoctorDashboardService } from './doctor-dashboard.service';
import { Doctor, DoctorSchema } from '../auth/entities/doctor.entity';
import { User, UserSchema } from '../auth/entities/user.entity';
import { Appointment, AppointmentSchema } from '../appointments/entities/appointment.entity';

@Module({
  imports: [
    // Mongoose module for database models
    MongooseModule.forFeature([
      { name: Doctor.name, schema: DoctorSchema },
      { name: User.name, schema: UserSchema },
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
  ],
  controllers: [DoctorDashboardController],
  providers: [DoctorDashboardService],
  exports: [DoctorDashboardService],
})
export class DoctorDashboardModule {}
