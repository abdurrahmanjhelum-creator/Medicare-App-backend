// Patients Module - Patients module configuration
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { Patient, PatientSchema } from '../auth/entities/patient.entity';
import { User, UserSchema } from '../auth/entities/user.entity';

@Module({
  imports: [
    // Mongoose module for database models
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
