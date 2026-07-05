// Appointments Controller - Appointment endpoints handle karne ke liye
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { GetAppointmentsDto } from './dto/get-appointments.dto';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  // Book Appointment endpoint - Naya appointment book karega (patient only)
  @Roles('patient')
  @Post()
  async bookAppointment(@Request() req, @Body() bookAppointmentDto: BookAppointmentDto) {
    return this.appointmentsService.bookAppointment(req.user.userId, bookAppointmentDto);
  }

  // Get Patient Appointments endpoint - Patient ke saare appointments lein (patient only)
  @Roles('patient')
  @Get()
  async getAppointments(@Request() req, @Query() getAppointmentsDto: GetAppointmentsDto) {
    return this.appointmentsService.getAppointments(req.user.userId, getAppointmentsDto);
  }

  // Get Appointment By ID endpoint - Single appointment ki details lein (patient only)
  @Roles('patient')
  @Get(':id')
  async getAppointmentById(@Request() req, @Param('id') appointmentId: string) {
    return this.appointmentsService.getAppointmentById(req.user.userId, appointmentId);
  }

  // Cancel Appointment endpoint - Appointment cancel karega (patient only)
  @Roles('patient')
  @Delete('cancel')
  async cancelAppointment(@Request() req, @Body() cancelAppointmentDto: CancelAppointmentDto) {
    return this.appointmentsService.cancelAppointment(req.user.userId, cancelAppointmentDto);
  }

  // Get Doctor Appointments endpoint - Doctor ke saare appointments lein (doctor only)
  @Roles('doctor')
  @Get('doctor/my-appointments')
  async getDoctorAppointments(@Request() req, @Query() getAppointmentsDto: GetAppointmentsDto) {
    return this.appointmentsService.getDoctorAppointments(req.user.userId, getAppointmentsDto);
  }

  // Update Appointment Status endpoint - Doctor appointment status update karega (doctor only)
  @Roles('doctor')
  @Put(':id/status')
  async updateAppointmentStatus(
    @Request() req,
    @Param('id') appointmentId: string,
    @Body() body: { status: string; doctorNotes?: string },
  ) {
    return this.appointmentsService.updateAppointmentStatus(
      req.user.userId,
      appointmentId,
      body.status,
      body.doctorNotes,
    );
  }
}
