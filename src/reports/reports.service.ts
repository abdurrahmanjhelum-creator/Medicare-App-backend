// Reports Service - Lab reports logic handle karne ke liye
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from './entities/report.entity';
import { Patient, PatientDocument } from '../auth/entities/patient.entity';
import { User, UserDocument } from '../auth/entities/user.entity';
import { GetReportsDto } from './dto/get-reports.dto';
import { UploadReportDto } from './dto/upload-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Get Reports method - Patient ke saare lab reports lein
  async getReports(userId: string, getReportsDto: GetReportsDto) {
    const { category, status, startDate, endDate } = getReportsDto;

    // Patient lein database se
    const patient = await this.patientModel.findOne({ userId });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    // Query build karein
    const query: any = { patientId: patient._id.toString() };

    // Agar category filter hai, toh add karein
    if (category) {
      query.category = category;
    }

    // Agar status filter hai, toh add karein
    if (status) {
      query.status = status;
    }

    // Agar date range hai, toh add karein
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = startDate;
      }
      if (endDate) {
        query.date.$lte = endDate;
      }
    }

    // Reports lein database se
    const reports = await this.reportModel
      .find(query)
      .sort({ date: -1, createdAt: -1 })
      .exec();

    return {
      reports,
      total: reports.length,
    };
  }

  // Upload Report method - Naya lab report upload karein
  async uploadReport(userId: string, uploadReportDto: UploadReportDto) {
    const { title, category, date, doctorName, fileUrl, notes } = uploadReportDto;

    // Patient lein database se
    const patient = await this.patientModel.findOne({ userId });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    // Patient user lein
    const patientUser = await this.userModel.findById(userId);
    if (!patientUser) {
      throw new NotFoundException('Patient user not found');
    }

    // Report create karein
    const report = await this.reportModel.create({
      patientId: patient._id.toString(),
      patientName: patientUser.name,
      title,
      category,
      date,
      doctorName,
      status: 'pending',
      fileUrl,
      notes,
    });

    return {
      message: 'Report uploaded successfully',
      report,
    };
  }

  // Get Report By ID method - Single lab report lein
  async getReportById(userId: string, reportId: string) {
    // Report lein database se
    const report = await this.reportModel.findById(reportId).exec();

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    // Patient lein database se
    const patient = await this.patientModel.findOne({ userId });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    // Check karein ke report patient ka hai
    if (report.patientId !== patient._id.toString()) {
      throw new Error('Aap sirf apne reports dekh sakte hain');
    }

    return { report };
  }

  // Delete Report method - Lab report delete karein
  async deleteReport(userId: string, reportId: string) {
    // Report lein database se
    const report = await this.reportModel.findById(reportId).exec();

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    // Patient lein database se
    const patient = await this.patientModel.findOne({ userId });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    // Check karein ke report patient ka hai
    if (report.patientId !== patient._id.toString()) {
      throw new Error('Aap sirf apne reports delete kar sakte hain');
    }

    // Report delete karein
    await this.reportModel.findByIdAndDelete(reportId);

    return {
      message: 'Report deleted successfully',
    };
  }

  // Update Report Status method - Report status update karein (internal use)
  async updateReportStatus(reportId: string, status: string) {
    // Report lein database se
    const report = await this.reportModel.findById(reportId);
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    // Status update karein
    report.status = status;
    await report.save();

    return report;
  }
}
