// Doctors Controller - Doctor management endpoints handle karne ke liye
import { Controller, Get, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('doctors')
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}

  // Get All Doctors endpoint - Saare doctors ki list lein (public)
  @Public()
  @Get()
  async getAllDoctors(@Query() query: any) {
    return this.doctorsService.getAllDoctors(query);
  }

  // Get Doctor By ID endpoint - Doctor ki details lein (public)
  @Public()
  @Get(':id')
  async getDoctorById(@Param('id') doctorId: string) {
    return this.doctorsService.getDoctorById(doctorId);
  }

  // Get Doctor Profile endpoint - Doctor ka apna profile lein (doctor only)
  @Roles('doctor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile/me')
  async getDoctorProfile(@Request() req) {
    return this.doctorsService.getDoctorProfile(req.user.userId);
  }

  // Update Doctor Profile endpoint - Doctor ka profile update karein (doctor only)
  @Roles('doctor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('profile/me')
  async updateDoctorProfile(@Request() req, @Body() updateProfileDto: any) {
    return this.doctorsService.updateDoctorProfile(req.user.userId, updateProfileDto);
  }
}
