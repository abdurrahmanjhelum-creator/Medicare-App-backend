// Medical Records Service - Medical records logic handle karne ke liye
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Patient, PatientDocument } from '../auth/entities/patient.entity';
import { Doctor, DoctorDocument } from '../auth/entities/doctor.entity';
import { User, UserDocument } from '../auth/entities/user.entity';

// Medical Record Entity
@Schema({ timestamps: true })
export class MedicalRecord extends Document {
  _id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  attachments: string[];
  appointmentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MedicalRecordDocument = MedicalRecord & Document;
export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectModel('MedicalRecord') private medicalRecordModel: Model<MedicalRecordDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /** Resolve patient by entity _id or userId (appointments use userId as patientId). */
  private async resolvePatient(patientIdOrUserId: string) {
    let patient = await this.patientModel.findById(patientIdOrUserId);
    if (!patient) {
      patient = await this.patientModel.findOne({ userId: patientIdOrUserId });
    }
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  // Create Medical Record method - Naya medical record create karein
  async createMedicalRecord(doctorId: string, createRecordDto: any) {
    const { patientId, diagnosis, prescription, notes, attachments, appointmentId } = createRecordDto;

    const patient = await this.resolvePatient(patientId);

    const doctor = await this.doctorModel.findOne({ userId: doctorId });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const patientUser = await this.userModel.findById(patient.userId);
    if (!patientUser) {
      throw new NotFoundException('Patient user not found');
    }

    const doctorUser = await this.userModel.findById(doctorId);

    const medicalRecord = await this.medicalRecordModel.create({
      patientId: patient._id.toString(),
      patientName: patientUser.name,
      doctorId,
      doctorName: doctorUser?.name || doctor.clinic,
      diagnosis,
      prescription,
      notes,
      attachments: attachments || [],
      appointmentId,
    });

    return {
      message: 'Medical record created successfully',
      medicalRecord,
    };
  }

  // Get Patient Medical Records method - Patient ke saare medical records lein
  async getPatientMedicalRecords(patientId: string) {
    const patient = await this.resolvePatient(patientId);

    const medicalRecords = await this.medicalRecordModel
      .find({ patientId: patient._id.toString() })
      .sort({ createdAt: -1 })
      .exec();

    return {
      medicalRecords,
      total: medicalRecords.length,
    };
  }

  // Get My Medical Records method - Patient ke apne medical records lein
  async getMyMedicalRecords(userId: string) {
    // Patient lein database se
    const patient = await this.patientModel.findOne({ userId });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    // Medical records lein database se
    const medicalRecords = await this.medicalRecordModel
      .find({ patientId: patient._id.toString() })
      .sort({ createdAt: -1 })
      .exec();

    return {
      medicalRecords,
      total: medicalRecords.length,
    };
  }

  // Get Medical Record By ID method - Single medical record lein
  async getMedicalRecordById(recordId: string) {
    // Medical record lein database se
    const medicalRecord = await this.medicalRecordModel.findById(recordId);
    if (!medicalRecord) {
      throw new NotFoundException('Medical record not found');
    }

    return { medicalRecord };
  }

  // Update Medical Record method - Medical record update karein
  async updateMedicalRecord(recordId: string, updateRecordDto: any) {
    // Medical record lein database se
    const medicalRecord = await this.medicalRecordModel.findById(recordId);
    if (!medicalRecord) {
      throw new NotFoundException('Medical record not found');
    }

    // Medical record update karein
    if (updateRecordDto.diagnosis !== undefined) {
      medicalRecord.diagnosis = updateRecordDto.diagnosis;
    }
    if (updateRecordDto.prescription !== undefined) {
      medicalRecord.prescription = updateRecordDto.prescription;
    }
    if (updateRecordDto.notes !== undefined) {
      medicalRecord.notes = updateRecordDto.notes;
    }
    if (updateRecordDto.attachments !== undefined) {
      medicalRecord.attachments = updateRecordDto.attachments;
    }
    await medicalRecord.save();

    return {
      message: 'Medical record updated successfully',
      medicalRecord,
    };
  }
}
