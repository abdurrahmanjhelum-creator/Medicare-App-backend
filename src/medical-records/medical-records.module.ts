// Medical Records Module - Medical records module configuration
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalRecordsController } from './medical-records.controller';
import { MedicalRecordsService } from './medical-records.service';
import { MedicalRecordSchema } from './medical-records.service';
import { Patient, PatientSchema } from '../auth/entities/patient.entity';
import { Doctor, DoctorSchema } from '../auth/entities/doctor.entity';
import { User, UserSchema } from '../auth/entities/user.entity';

@Module({
  imports: [
    // Mongoose module for database models
    MongooseModule.forFeature([
      { name: 'MedicalRecord', schema: MedicalRecordSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService],
  exports: [MedicalRecordsService],
})
export class MedicalRecordsModule {}
