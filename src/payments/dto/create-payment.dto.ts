// Create Payment DTO - Payment create karne ke liye
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreatePaymentDto {
  // Appointment ID - jis appointment ke liye payment hai
  @IsString()
  @IsNotEmpty({ message: 'Appointment ID zaroori hai' })
  appointmentId: string;

  // Amount - payment ka amount
  @IsNumber()
  @Min(0, { message: 'Amount minimum 0 hona chahiye' })
  @IsNotEmpty({ message: 'Amount zaroori hai' })
  amount: number;

  // Payment method - payment ka method (card, cash, etc.)
  @IsString()
  @IsNotEmpty({ message: 'Payment method zaroori hai' })
  paymentMethod: string;
}
