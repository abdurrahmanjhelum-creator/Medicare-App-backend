// Patient Dashboard Controller - Patient dashboard endpoints handle karne ke liye
import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { PatientDashboardService } from './patient-dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('patient-dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientDashboardController {
  constructor(private patientDashboardService: PatientDashboardService) {}

  // Get Profile endpoint - Patient ka apna profile lein (patient only)
  @Roles('patient')
  @Get('profile')
  async getProfile(@Request() req) {
    return this.patientDashboardService.getProfile(req.user.userId);
  }

  // Update Profile endpoint - Patient ka profile update karein (patient only)
  @Roles('patient')
  @Put('profile')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.patientDashboardService.updateProfile(req.user.userId, updateProfileDto);
  }

  // Get Dashboard Stats endpoint - Patient ke dashboard statistics lein (patient only)
  @Roles('patient')
  @Get('stats')
  async getDashboardStats(@Request() req) {
    return this.patientDashboardService.getDashboardStats(req.user.userId);
  }

  // Get Upcoming Appointments endpoint - Patient ke upcoming appointments lein (patient only)
  @Roles('patient')
  @Get('upcoming-appointments')
  async getUpcomingAppointments(@Request() req) {
    return this.patientDashboardService.getUpcomingAppointments(req.user.userId);
  }

  // Get Medical History endpoint - Patient ki medical history lein (patient only)
  @Roles('patient')
  @Get('medical-history')
  async getMedicalHistory(@Request() req) {
    return this.patientDashboardService.getMedicalHistory(req.user.userId);
  }
}
