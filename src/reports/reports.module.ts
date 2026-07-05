// Reports Module - Lab reports module configuration
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Report, ReportSchema } from './entities/report.entity';
import { Patient, PatientSchema } from '../auth/entities/patient.entity';
import { User, UserSchema } from '../auth/entities/user.entity';

@Module({
  imports: [
    // Mongoose module for database models
    MongooseModule.forFeature([
      { name: Report.name, schema: ReportSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
