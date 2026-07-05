// Medical Records Controller - Medical records endpoints handle karne ke liye
import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('medical-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicalRecordsController {
  constructor(private medicalRecordsService: MedicalRecordsService) {}

  // Create Medical Record endpoint - Naya medical record create karein (doctor only)
  @Roles('doctor')
  @Post()
  async createMedicalRecord(@Request() req, @Body() createRecordDto: any) {
    return this.medicalRecordsService.createMedicalRecord(req.user.userId, createRecordDto);
  }

  // Get Patient Medical Records endpoint - Patient ke saare medical records lein (doctor only)
  @Roles('doctor')
  @Get('patient/:patientId')
  async getPatientMedicalRecords(@Param('patientId') patientId: string) {
    return this.medicalRecordsService.getPatientMedicalRecords(patientId);
  }

  // Get My Medical Records endpoint - Apne medical records lein (patient only)
  @Roles('patient')
  @Get('my-records')
  async getMyMedicalRecords(@Request() req) {
    return this.medicalRecordsService.getMyMedicalRecords(req.user.userId);
  }

  // Get Medical Record By ID endpoint - Single medical record lein
  @Get(':id')
  async getMedicalRecordById(@Param('id') recordId: string) {
    return this.medicalRecordsService.getMedicalRecordById(recordId);
  }

  // Update Medical Record endpoint - Medical record update karein (doctor only)
  @Roles('doctor')
  @Put(':id')
  async updateMedicalRecord(@Param('id') recordId: string, @Body() updateRecordDto: any) {
    return this.medicalRecordsService.updateMedicalRecord(recordId, updateRecordDto);
  }
}
