// Patients Controller - Patient management endpoints handle karne ke liye
import { Controller, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  // Get Patient Profile endpoint - Patient ka profile lein (patient only)
  @Roles('patient')
  @Get('profile')
  async getPatientProfile(@Request() req) {
    return this.patientsService.getPatientProfile(req.user.userId);
  }

  // Update Patient Profile endpoint - Patient ka profile update karein (patient only)
  @Roles('patient')
  @Put('profile')
  async updatePatientProfile(@Request() req, @Body() updateProfileDto: any) {
    return this.patientsService.updatePatientProfile(req.user.userId, updateProfileDto);
  }

  // Get Patient By ID endpoint - Doctor patient ki details le sakta hai (doctor only)
  @Roles('doctor')
  @Get(':id')
  async getPatientById(@Param('id') patientId: string) {
    return this.patientsService.getPatientById(patientId);
  }
}
