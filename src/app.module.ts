// App Module - Root module of the application
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ChatModule } from './chat/chat.module';
import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { DoctorDashboardModule } from './doctor-dashboard/doctor-dashboard.module';
import { PatientDashboardModule } from './patient-dashboard/patient-dashboard.module';
import { ReviewsModule } from './reviews/reviews.module';
import { EmergencyModule } from './emergency/emergency.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    // Environment variables configuration
    ConfigModule.forRoot({
      isGlobal: true, // Global access to env variables
    }),
    // MongoDB connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/medicare',
      }),
      inject: [ConfigService],
    }),
    // Feature modules
    AuthModule,
    AppointmentsModule,
    ChatModule,
    PatientsModule,
    DoctorsModule,
    MedicalRecordsModule,
    DoctorDashboardModule,
    PatientDashboardModule,
    ReviewsModule,
    EmergencyModule,
    NotificationsModule,
    PaymentsModule,
    ReportsModule,
    UsersModule,
    PharmacyModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
