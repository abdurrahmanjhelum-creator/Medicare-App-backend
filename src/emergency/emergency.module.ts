// Emergency Module - Emergency contacts module configuration
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmergencyController } from './emergency.controller';
import { EmergencyService } from './emergency.service';
import { EmergencyContact, EmergencyContactSchema } from './entities/emergency-contact.entity';

@Module({
  imports: [
    // Mongoose module for database models
    MongooseModule.forFeature([
      { name: EmergencyContact.name, schema: EmergencyContactSchema },
    ]),
  ],
  controllers: [EmergencyController],
  providers: [EmergencyService],
  exports: [EmergencyService],
})
export class EmergencyModule {}
