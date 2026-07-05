// Payments Controller - Payments endpoints handle karne ke liye
import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GetPaymentsDto } from './dto/get-payments.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  // Create Payment endpoint - Naya payment create karein (protected)
  @Post()
  async createPayment(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createPayment(req.user.userId, createPaymentDto);
  }

  // Get Payments endpoint - User ke saare payments lein (protected)
  @Get()
  async getPayments(@Request() req, @Body() getPaymentsDto: GetPaymentsDto) {
    return this.paymentsService.getPayments(req.user.userId, getPaymentsDto);
  }

  // Get Payment By ID endpoint - Single payment lein (protected)
  @Get(':id')
  async getPaymentById(@Request() req, @Param('id') paymentId: string) {
    return this.paymentsService.getPaymentById(req.user.userId, paymentId);
  }

  // Request Refund endpoint - Refund request karein (protected)
  @Post(':id/refund')
  async requestRefund(@Request() req, @Param('id') paymentId: string) {
    return this.paymentsService.requestRefund(req.user.userId, paymentId);
  }
}
