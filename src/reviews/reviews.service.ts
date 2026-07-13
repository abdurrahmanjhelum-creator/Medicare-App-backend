// Reviews Service - Reviews logic handle karne ke liye
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './entities/review.entity';
import { Doctor, DoctorDocument } from '../auth/entities/doctor.entity';
import { Patient, PatientDocument } from '../auth/entities/patient.entity';
import { User, UserDocument } from '../auth/entities/user.entity';
import { Appointment, AppointmentDocument } from '../appointments/entities/appointment.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { GetReviewsDto } from './dto/get-reviews.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
  ) {}

  // Create Review method - Naya review create karein
  async createReview(patientUserId: string, createReviewDto: CreateReviewDto) {
    const { appointmentId, doctorId, rating, comment } = createReviewDto;

    // 1. Patient profile check karein
    const patient = await this.patientModel.findOne({ userId: patientUserId });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    // 2. Appointment check karein
    const appointment = await this.appointmentModel.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // 3. Business Rules Validation
    // Check if appointment belongs to this patient
    if (appointment.patientId !== patientUserId) {
      throw new ForbiddenException('Aap sirf apni appointments ka review de sakte hain');
    }

    // Check if appointment belongs to this doctor
    if (appointment.doctorId !== doctorId) {
      throw new BadRequestException('Appointment is doctor ki nahi hai');
    }

    // Check if status is completed
    if (appointment.status !== 'completed') {
      throw new BadRequestException('Aap sirf completed appointments ka review de sakte hain');
    }

    // 4. Check for duplicate review for this appointment
    const existingReview = await this.reviewModel.findOne({ appointmentId });
    if (existingReview) {
      throw new BadRequestException('Aap is appointment ka review already de chuke hain');
    }

    // 5. Doctor existence check
    const doctor = await this.doctorModel.findById(doctorId);
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // 6. Patient user details lein
    const patientUser = await this.userModel.findById(patientUserId);
    if (!patientUser) {
      throw new NotFoundException('Patient user not found');
    }

    // 7. Review create karein
    const review = await this.reviewModel.create({
      appointmentId,
      patientId: patientUserId,
      patientName: patientUser.name,
      doctorId,
      doctorName: doctor.clinic, // Using clinic name as doctor name identifier here, or use user.name if preferred
      rating,
      comment,
    });

    // 8. Doctor ki rating update karein
    await this.updateDoctorRating(doctorId);

    return {
      message: 'Review created successfully',
      review,
    };
  }

  // Get Reviews By Doctor ID method - Doctor ke saare reviews lein
  async getReviewsByDoctorId(getReviewsDto: GetReviewsDto) {
    const { doctorId, page = 1, limit = 10 } = getReviewsDto;

    // Pagination calculate karein
    const skip = (page - 1) * limit;

    // Reviews lein database se
    const reviews = await this.reviewModel
      .find({ doctorId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Total count calculate karein
    const total = await this.reviewModel.countDocuments({ doctorId });

    // Average rating calculate karein
    const reviewsForAvg = await this.reviewModel.find({ doctorId });
    const avgRating = reviewsForAvg.length > 0
      ? reviewsForAvg.reduce((sum, r) => sum + r.rating, 0) / reviewsForAvg.length
      : 0;

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      averageRating: parseFloat(avgRating.toFixed(1)),
      totalReviews: total,
    };
  }

  // Delete Review method - Review delete karein
  async deleteReview(patientUserId: string, deleteReviewDto: DeleteReviewDto) {
    const { reviewId } = deleteReviewDto;

    // Review lein database se
    const review = await this.reviewModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Check karein ke review patient ka hai
    if (review.patientId !== patientUserId) {
      throw new ForbiddenException('Aap sirf apne reviews delete kar sakte hain');
    }

    // Review delete karein
    const doctorId = review.doctorId;
    await this.reviewModel.findByIdAndDelete(reviewId);

    // Doctor ki rating update karein
    await this.updateDoctorRating(doctorId);

    return {
      message: 'Review deleted successfully',
    };
  }

  // Get My Reviews method - Current patient ke saare reviews lein
  async getMyReviews(patientUserId: string) {
    // Reviews lein database se
    const reviews = await this.reviewModel
      .find({ patientId: patientUserId })
      .sort({ createdAt: -1 })
      .exec();

    return {
      reviews,
      total: reviews.length,
    };
  }

  // Update Doctor Rating method - Doctor ki average rating recalculate karein
  private async updateDoctorRating(doctorId: string) {
    // Saare reviews lein is doctor ke
    const reviews = await this.reviewModel.find({ doctorId });

    // Agar koi review nahi hai, toh rating 0 karein
    if (reviews.length === 0) {
      await this.doctorModel.findByIdAndUpdate(doctorId, {
        rating: 0,
        totalReviews: 0,
      });
      return;
    }

    // Average rating calculate karein
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;

    // Doctor ki rating update karein
    await this.doctorModel.findByIdAndUpdate(doctorId, {
      rating: parseFloat(avgRating.toFixed(1)),
      totalReviews: reviews.length,
    });
  }
}
