// Doctor Dashboard Controller - Doctor dashboard endpoints handle karne ke liye
import { Controller, Get, Put, Body, Query, UseGuards, Request } from '@nestjs/common';
import { DoctorDashboardService } from './doctor-dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { GetEarningsDto } from './dto/get-earnings.dto';
import { GetStatsDto } from './dto/get-stats.dto';

@Controller('doctor-dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorDashboardController {
  constructor(private doctorDashboardService: DoctorDashboardService) {}

  // Get Profile endpoint - Doctor ka apna profile lein (doctor only)
  @Roles('doctor')
  @Get('profile')
  async getProfile(@Request() req) {
    return this.doctorDashboardService.getProfile(req.user.userId);
  }

  // Update Profile endpoint - Doctor ka profile update karein (doctor only)
  @Roles('doctor')
  @Put('profile')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.doctorDashboardService.updateProfile(req.user.userId, updateProfileDto);
  }

  // Update Schedule endpoint - Doctor ki availability schedule update karein (doctor only)
  @Roles('doctor')
  @Put('schedule')
  async updateSchedule(@Request() req, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.doctorDashboardService.updateSchedule(req.user.userId, updateScheduleDto);
  }

  // Get Earnings endpoint - Doctor ki earnings lein date range ke saath (doctor only)
  @Roles('doctor')
  @Get('earnings')
  async getEarnings(@Request() req, @Query() getEarningsDto: GetEarningsDto) {
    return this.doctorDashboardService.getEarnings(req.user.userId, getEarningsDto);
  }

  // Get Stats endpoint - Doctor ki statistics lein (doctor only)
  @Roles('doctor')
  @Get('stats')
  async getStats(@Request() req, @Query() getStatsDto: GetStatsDto) {
    return this.doctorDashboardService.getStats(req.user.userId);
  }
}
