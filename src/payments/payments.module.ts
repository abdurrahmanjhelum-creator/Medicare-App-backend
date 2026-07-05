// Payments Module - Payments module configuration
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { Appointment, AppointmentSchema } from '../appointments/entities/appointment.entity';
import { User, UserSchema } from '../auth/entities/user.entity';

@Module({
  imports: [
    // Mongoose module for database models
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
