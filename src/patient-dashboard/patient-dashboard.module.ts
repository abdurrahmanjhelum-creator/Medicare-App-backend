// Patient Dashboard Module - Patient dashboard module configuration
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientDashboardController } from './patient-dashboard.controller';
import { PatientDashboardService } from './patient-dashboard.service';
import { Patient, PatientSchema } from '../auth/entities/patient.entity';
import { User, UserSchema } from '../auth/entities/user.entity';
import { Appointment, AppointmentSchema } from '../appointments/entities/appointment.entity';
import { MedicalRecordSchema } from '../medical-records/medical-records.service';

@Module({
  imports: [
    // Mongoose module for database models
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: User.name, schema: UserSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: 'MedicalRecord', schema: MedicalRecordSchema },
    ]),
  ],
  controllers: [PatientDashboardController],
  providers: [PatientDashboardService],
  exports: [PatientDashboardService],
})
export class PatientDashboardModule {}
