// Reports Controller - Lab reports endpoints handle karne ke liye
import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetReportsDto } from './dto/get-reports.dto';
import { UploadReportDto } from './dto/upload-report.dto';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  // Get Reports endpoint - Patient ke saare lab reports lein (patient only)
  @Roles('patient')
  @Get()
  async getReports(@Request() req, @Body() getReportsDto: GetReportsDto) {
    return this.reportsService.getReports(req.user.userId, getReportsDto);
  }

  // Upload Report endpoint - Naya lab report upload karein (patient only)
  @Roles('patient')
  @Post()
  async uploadReport(@Request() req, @Body() uploadReportDto: UploadReportDto) {
    return this.reportsService.uploadReport(req.user.userId, uploadReportDto);
  }

  // Get Report By ID endpoint - Single lab report lein (patient only)
  @Roles('patient')
  @Get(':id')
  async getReportById(@Request() req, @Param('id') reportId: string) {
    return this.reportsService.getReportById(req.user.userId, reportId);
  }

  // Delete Report endpoint - Lab report delete karein (patient only)
  @Roles('patient')
  @Delete(':id')
  async deleteReport(@Request() req, @Param('id') reportId: string) {
    return this.reportsService.deleteReport(req.user.userId, reportId);
  }
}
