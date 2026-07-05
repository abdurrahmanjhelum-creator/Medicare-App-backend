// Payments Service - Payments logic handle karne ke liye
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './entities/payment.entity';
import { Appointment, AppointmentDocument } from '../appointments/entities/appointment.entity';
import { User, UserDocument } from '../auth/entities/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GetPaymentsDto } from './dto/get-payments.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Create Payment method - Naya payment create karein
  async createPayment(userId: string, createPaymentDto: CreatePaymentDto) {
    const { appointmentId, amount, paymentMethod } = createPaymentDto;

    // Appointment lein database se
    const appointment = await this.appointmentModel.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // User lein database se
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Payment create karein (pending status ke saath)
    const payment = await this.paymentModel.create({
      userId,
      userName: user.name,
      appointmentId,
      amount,
      currency: 'PKR',
      status: 'pending',
      paymentMethod,
    });

    return {
      message: 'Payment created successfully',
      payment,
    };
  }

  // Get Payments method - User ke saare payments lein
  async getPayments(userId: string, getPaymentsDto: GetPaymentsDto) {
    const { status, startDate, endDate } = getPaymentsDto;

    // Query build karein
    const query: any = { userId };

    // Agar status filter hai, toh add karein
    if (status) {
      query.status = status;
    }

    // Agar date range hai, toh add karein
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Payments lein database se
    const payments = await this.paymentModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();

    // Total amount calculate karein
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    return {
      payments,
      total: payments.length,
      totalAmount,
    };
  }

  // Get Payment By ID method - Single payment lein
  async getPaymentById(userId: string, paymentId: string) {
    // Payment lein database se
    const payment = await this.paymentModel.findById(paymentId).exec();

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Check karein ke payment user ka hai
    if (payment.userId !== userId) {
      throw new Error('Aap sirf apne payments dekh sakte hain');
    }

    return { payment };
  }

  // Update Payment Status method - Payment status update karein (internal use)
  async updatePaymentStatus(paymentId: string, status: string, transactionId?: string, failureReason?: string) {
    // Payment lein database se
    const payment = await this.paymentModel.findById(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Status update karein
    payment.status = status;
    if (transactionId) {
      payment.transactionId = transactionId;
    }
    if (failureReason) {
      payment.failureReason = failureReason;
    }
    await payment.save();

    // Agar payment successful hai, toh appointment status update karein
    if (status === 'completed') {
      await this.appointmentModel.findByIdAndUpdate(payment.appointmentId, {
        status: 'confirmed',
      });
    }

    return payment;
  }

  // Request Refund method - Refund request karein
  async requestRefund(userId: string, paymentId: string) {
    // Payment lein database se
    const payment = await this.paymentModel.findById(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Check karein ke payment user ka hai
    if (payment.userId !== userId) {
      throw new Error('Aap sirf apne payments refund request kar sakte hain');
    }

    // Check karein ke payment completed hai
    if (payment.status !== 'completed') {
      throw new Error('Sirf completed payments refund kiye ja sakte hain');
    }

    // Payment status refund karein
    payment.status = 'refunded';
    await payment.save();

    // Appointment status update karein
    await this.appointmentModel.findByIdAndUpdate(payment.appointmentId, {
      status: 'cancelled',
    });

    return {
      message: 'Refund requested successfully',
      payment,
    };
  }
}
